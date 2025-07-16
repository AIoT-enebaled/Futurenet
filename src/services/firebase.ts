import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  enableNetwork,
  disableNetwork,
  getDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Core User Interface
export type User = {
  uid: string;
  email: string;
  displayName: string;
  role: "student" | "instructor" | "admin";
  profileImageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  roles: UserRole; // Added roles here as they are part of the user document in Firestore
};

export type UserRole = {
  reader: boolean;
  author: boolean;
  admin: boolean;
};

// Course and Content Interfaces
export type Course = {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  category: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  thumbnailUrl?: string;
  isPublished: boolean;
  maxStudents?: number;
  enrollmentCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  duration?: number; // in minutes
  isPreview: boolean;
  createdAt: Timestamp;
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  totalPoints: number;
  instructions: string[];
  attachments: string[];
  createdAt: Timestamp;
};

// Authentication and Role-Based Access Control
// CustomUser represents the authenticated user with their Firestore profile data
export class CustomUser {
  uid: string;
  email: string;
  displayName: string;
  role: User["role"];
  roles: UserRole;
  profileImageUrl?: string; // Added profileImageUrl
  createdAt: Timestamp; // Added createdAt
  updatedAt: Timestamp;

  constructor(userProfile: User) {
    this.uid = userProfile.uid;
    this.email = userProfile.email;
    this.displayName = userProfile.displayName;
    this.role = userProfile.role;
    this.roles = userProfile.roles;
    this.profileImageUrl = userProfile.profileImageUrl;
    this.createdAt = userProfile.createdAt;
    this.updatedAt = userProfile.updatedAt;
  }

  hasRole(role: keyof UserRole): boolean {
    return this.roles[role];
  }
}

export class AuthService {
  async signIn(email: string, password: string): Promise<CustomUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    // After signing in via Auth, fetch the user's profile from Firestore
    const userProfile = await this.getUserProfile(credential.user.uid);
    if (!userProfile) {
      // Handle case where auth user exists but profile doesn't (shouldn't happen if signup creates it)
      // You might want to automatically create a basic profile here or redirect to a profile creation page
      console.error(
        "User profile not found for authenticated user:",
        credential.user.uid,
      );
      throw new Error("User profile not found. Please contact support.");
    }
    // Create CustomUser instance with the fetched profile data
    return new CustomUser(userProfile);
  }

  async signUp(
    email: string,
    password: string,
    displayName: string,
    role: User["role"],
  ): Promise<CustomUser> {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const uid = credential.user.uid;

    //Update display name on auth
    await updateProfile(credential.user, { displayName: displayName });

    // Define initial roles based on the selected role during signup
    const initialRoles: UserRole = {
      reader: true,
      author: role === "instructor" || role === "admin",
      admin: role === "admin",
    };

    const newUserProfile: User = {
      uid: uid,
      email: email,
      displayName: displayName,
      role: role,
      roles: initialRoles,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      // profileImageUrl will be undefined initially
    };

    await this.createUserProfile(newUserProfile); // Create profile in Firestore

    // Fetch the created profile to return a consistent CustomUser object
    const createdProfile = await this.getUserProfile(uid);
    if (!createdProfile) {
      throw new Error("Failed to retrieve created user profile.");
    }

    return new CustomUser(createdProfile);
  }

  async createUserProfile(userProfile: User): Promise<void> {
    const userDocRef = doc(db, "users", userProfile.uid);
    await setDoc(userDocRef, userProfile);
  }

  async getUserProfile(uid: string): Promise<User | null> {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (
        data &&
        typeof data.email === "string" &&
        typeof data.displayName === "string" &&
        typeof data.role === "string" &&
        data.createdAt instanceof Timestamp &&
        data.updatedAt instanceof Timestamp &&
        typeof data.roles === "object"
      ) {
        return {
          uid: uid,
          email: data.email,
          displayName: data.displayName,
          role: data.role as User["role"], // Type assertion for role
          profileImageUrl:
            typeof data.profileImageUrl === "string"
              ? data.profileImageUrl
              : undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          roles: data.roles as UserRole,
        };
      } else {
        console.error("Incomplete or invalid user data in Firestore.", data);
        return null;
      }
    }
    return null;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  // Method to observe auth state changes and fetch user profile
  onAuthStateChanged(callback: (user: CustomUser | null) => void) {
    // onAuthStateChanged returns an unsubscribe function
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If authenticated user exists, fetch their full profile from Firestore
        const userProfile = await this.getUserProfile(user.uid);
        if (userProfile) {
          // Create CustomUser instance with full profile data
          callback(new CustomUser(userProfile));
        } else {
          // Handle case where auth user exists but profile doesn't in Firestore
          console.error(
            "Authenticated user profile not found in Firestore for UID:",
            user.uid,
          );
          // Depending on your app's logic, you might sign out the user,
          // redirect to a profile creation page, or handle this state differently.
          // For now, we'll return null, effectively treating them as not fully logged in within the app's context.
          callback(null);
          // Optionally sign out the user if a profile is mandatory
          // signOut(auth);
        }
      } else {
        // If no authenticated user, pass null to the callback
        callback(null);
      }
    });
  }
}

// File Upload and Storage Integration
export class FileUploadService {
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  }

  async uploadCourseVideo(courseId: string, file: File) {
    const fileName = `${Date.now()}_${file.name}`;
    const path = `courses/${courseId}/videos/${fileName}`;
    return this.uploadFile(file, path);
  }

  async uploadAssignmentSubmission(
    assignmentId: string,
    userId: string,
    file: File,
  ) {
    const fileName = `${Date.now()}_${file.name}`;
    const path = `assignments/${assignmentId}/submissions/${userId}/${fileName}`;
    return this.uploadFile(file, path);
  }
}

// Real-time Features with TypeScript
export class DiscussionService {
  subscribeToMessages(
    discussionId: string,
    callback: (messages: any[]) => void,
  ) {
    const messagesRef = collection(db, "discussions", discussionId, "messages");
    const q = query(messagesRef, orderBy("createdAt"), limit(50));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    });
  }

  async sendMessage(
    discussionId: string,
    userId: string,
    content: string,
  ): Promise<void> {
    const messagesRef = collection(db, "discussions", discussionId, "messages");
    await addDoc(messagesRef, {
      userId,
      content,
      createdAt: serverTimestamp(),
    });
  }
}

// Offline Support and Caching
export class OfflineService {
  async enableOfflineMode(): Promise<void> {
    await disableNetwork(db);
  }

  async enableOnlineMode(): Promise<void> {
    await enableNetwork(db);
  }
}

// Cloud Functions Integration
interface EnrollmentRequest {
  courseId: string;
  userId: string;
}

interface EnrollmentResponse {
  success: boolean;
  enrollmentId?: string;
  error?: string;
}

export class CloudFunctionsService {
  // Ensure the function name 'enrollStudent' matches your deployed Cloud Function
  private enrollStudent = httpsCallable<EnrollmentRequest, EnrollmentResponse>(
    functions,
    "enrollStudent",
  );

  async enrollInCourse(
    courseId: string,
    userId: string,
  ): Promise<EnrollmentResponse> {
    // Cloud Functions authentication context will have request.auth set if the user is logged in.
    const result = await this.enrollStudent({ courseId, userId });
    return result.data;
  }
}

// Performance Optimization
export class CourseService {
  // Consider a more sophisticated caching strategy for production, like using a state management library
  private courseCache = new Map<string, Course>();

  async getCourse(courseId: string): Promise<Course | null> {
    // Check cache first
    if (this.courseCache.has(courseId)) {
      return this.courseCache.get(courseId)!;
    }

    const courseDoc = await getDoc(doc(db, "courses", courseId));
    if (courseDoc.exists()) {
      // Type casting assumes the data structure matches the Course interface
      const course = { id: courseDoc.id, ...courseDoc.data() } as Course;
      this.courseCache.set(courseId, course);
      return course;
    }

    return null;
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    // Note: This query gets enrollments first, then fetches each course individually.
    // For a large number of enrollments, this might be inefficient (N+1 reads).
    // Consider denormalizing some course data into the enrollment document or using a Cloud Function.
    const enrollmentsQuery = query(
      collection(db, "enrollments"),
      where("userId", "==", userId),
      orderBy("enrolledAt", "desc"), // Assuming an 'enrolledAt' field exists
      limit(20), // Limiting results for performance
    );

    const enrollments = await getDocs(enrollmentsQuery);
    const coursePromises = enrollments.docs.map(
      (doc) => this.getCourse(doc.data().courseId), // Reusing getCourse, which uses caching
    );

    const courses = await Promise.all(coursePromises);
    return courses.filter((course) => course !== null) as Course[];
  }
}

export { Timestamp };
