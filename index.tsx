
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import App from './App';

const firebaseConfig = {
  apiKey: "AIzaSyAHx3LhbqyqlDANJbpos4i-R6NZl1HcbOc",
  authDomain: "futurenet-a321f.firebaseapp.com",
  projectId: "futerenetv0",
  storageBucket: "futerenetv0.firebasestorage.app",
  messagingSenderId: "520383737800",
  appId: "1:520383737800:web:e96e4b47b811e6dff45afd",
  measurementId: "G-D0Y0PQJ3X8"
};

const app = initializeApp(firebaseConfig); // Corrected: initializeApp is now imported
const auth = getAuth(app);
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App auth={auth} />
  </React.StrictMode>
);
