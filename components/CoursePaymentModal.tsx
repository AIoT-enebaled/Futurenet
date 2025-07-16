import React, { useState } from "react";
import { Course, User } from "../types";
import {
  CreditCardIcon,
  LockIcon,
  CheckCircleIcon,
  DollarSignIcon,
  CalendarIcon,
} from "./icons";
import Modal from "./Modal";

interface CoursePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  currentUser: User;
  onPurchaseComplete: (courseId: string, paymentMethod: string) => void;
}

const CoursePaymentModal: React.FC<CoursePaymentModalProps> = ({
  isOpen,
  onClose,
  course,
  currentUser,
  onPurchaseComplete,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "card" | "paypal" | "crypto"
  >("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: currentUser.email,
    country: "US",
  });

  const handleInputChange = (
    field: keyof typeof paymentData,
    value: string,
  ) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPurchaseComplete(course.id, selectedPaymentMethod);
      onClose();

      // Reset form
      setPaymentData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
        email: currentUser.email,
        country: "US",
      });
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2");
  };

  const commonInputStyles =
    "w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text placeholder-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple text-sm";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Course" size="lg">
      <div className="space-y-6">
        {/* Course Summary */}
        <div className="bg-brand-bg p-4 rounded-lg border border-brand-border">
          <div className="flex items-start space-x-4">
            <img
              src={course.imageUrl || "https://picsum.photos/100/60"}
              alt={course.title}
              className="w-20 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-brand-text">{course.title}</h3>
              <p className="text-sm text-brand-text-muted mt-1">
                {course.subtitle}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-brand-text-darker">
                  {course.modules.reduce(
                    (acc, mod) => acc + mod.lessons.length,
                    0,
                  )}{" "}
                  lessons • {course.durationHours}h total
                </span>
                <span className="text-2xl font-bold text-brand-purple">
                  ${course.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <h4 className="text-lg font-semibold text-brand-text mb-4">
            Payment Method
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: "card",
                name: "Credit Card",
                icon: CreditCardIcon,
                description: "Visa, Mastercard, Amex",
              },
              {
                id: "paypal",
                name: "PayPal",
                icon: DollarSignIcon,
                description: "Pay with PayPal",
              },
              {
                id: "crypto",
                name: "Crypto",
                icon: LockIcon,
                description: "Bitcoin, Ethereum",
              },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedPaymentMethod(method.id as any)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedPaymentMethod === method.id
                    ? "border-brand-purple bg-brand-purple/10"
                    : "border-brand-border hover:border-brand-purple/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <method.icon className="w-6 h-6 text-brand-purple" />
                  <div>
                    <p className="font-medium text-brand-text">{method.name}</p>
                    <p className="text-xs text-brand-text-muted">
                      {method.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-4">
          {selectedPaymentMethod === "card" && (
            <>
              <div>
                <label
                  htmlFor="cardName"
                  className="block text-sm font-medium text-brand-text mb-1"
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardName"
                  value={paymentData.cardName}
                  onChange={(e) =>
                    handleInputChange("cardName", e.target.value)
                  }
                  placeholder="John Doe"
                  className={commonInputStyles}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-brand-text mb-1"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "cardNumber",
                      formatCardNumber(e.target.value),
                    )
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={commonInputStyles}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-brand-text mb-1"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={(e) =>
                      handleInputChange(
                        "expiryDate",
                        formatExpiryDate(e.target.value),
                      )
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                    className={commonInputStyles}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-brand-text mb-1"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={paymentData.cvv}
                    onChange={(e) =>
                      handleInputChange(
                        "cvv",
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    placeholder="123"
                    maxLength={4}
                    className={commonInputStyles}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {selectedPaymentMethod === "paypal" && (
            <div className="text-center py-8">
              <DollarSignIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-brand-text-muted">
                You will be redirected to PayPal to complete your payment
              </p>
            </div>
          )}

          {selectedPaymentMethod === "crypto" && (
            <div className="text-center py-8">
              <LockIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-brand-text-muted">
                You will be redirected to our crypto payment processor
              </p>
            </div>
          )}

          {/* Billing Information */}
          <div className="border-t border-brand-border pt-4">
            <h5 className="font-medium text-brand-text mb-3">
              Billing Information
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-brand-text mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={paymentData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={commonInputStyles}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-brand-text mb-1"
                >
                  Country
                </label>
                <select
                  id="country"
                  value={paymentData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className={commonInputStyles}
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="IN">India</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Access Information */}
          <div className="bg-brand-surface p-4 rounded-lg border border-brand-border">
            <h5 className="font-medium text-brand-text mb-2 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2 text-green-400" />
              What You Get
            </h5>
            <ul className="text-sm text-brand-text-muted space-y-1">
              <li>• Lifetime access to all course content</li>
              <li>• Access to live classes and recordings</li>
              <li>• Course completion certificate</li>
              <li>• Community access and instructor support</li>
              <li>• Mobile and desktop access</li>
              <li>• 30-day money-back guarantee</li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-brand-text-muted">
            <LockIcon className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-brand-text-muted bg-brand-surface-alt hover:bg-opacity-80 rounded-lg border border-brand-border hover:border-brand-purple/50 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed min-w-[120px]"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay $${course.price.toFixed(2)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CoursePaymentModal;
