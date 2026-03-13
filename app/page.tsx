"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [seatNumber, setSeatNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  interface VerifyStudentRequest {
    name: string;
    email: string;
  }

  interface VerifyStudentResponse {
    success: boolean;
    seatNumber?: string;
    message?: string;
  }

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const requestBody: VerifyStudentRequest = {
        name: name.trim(),
        email: email.trim(),
      };

      const response = await fetch("/api/verify-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result: VerifyStudentResponse = await response.json();

      if (response.ok && result.success) {
        setSeatNumber(result.seatNumber || "");
        setSuccess(true);
      } else {
        setError(
          result.message || "Verification failed. Please check your details.",
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="w-full max-w-md">
          {/* Success Animation */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6 animate-slideUp">
            {/* Checkmark Circle with Animation */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg">
                <svg
                  className="w-12 h-12 text-white animate-checkmark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">
                Verification Success!
              </h1>
              {name && (
                <p className="text-3xl font-bold text-blue-400">{name}</p>
              )}
            </div>

            {/* Seat Number Card */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
              <p className="text-sm text-gray-600 mb-2">Your Seat Number</p>
              <p className="text-5xl font-bold text-red-600 tracking-wider">
                {seatNumber}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-2xl p-5 border-l-4 border-blue-400">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Please show your{" "}
                  <span className="font-bold text-gray-900">passport</span> and
                  this success message to the guard/staff at the hall entrance.
                </p>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes checkmark {
            0% {
              stroke-dasharray: 0, 100;
            }
            100% {
              stroke-dasharray: 100, 0;
            }
          }
          .animate-slideUp {
            animation: slideUp 0.5s ease-out;
          }
          .animate-checkmark {
            stroke-dasharray: 100;
            animation: checkmark 0.6s ease-in-out 0.2s forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-center">
            <div className="space-y-4">
              {/* Logo Placeholders */}
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-white rounded-2xl p-3 shadow-2xl border-2 border-white/50 transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/laurea-logo.jpeg"
                    alt="Laurea UAS"
                    width={128}
                    height={64}
                    className="w-32 h-16 object-contain"
                  />
                </div>
                <div className="bg-white rounded-2xl p-3 shadow-2xl border-2 border-white/50 transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/unigo-logo.png"
                    alt="UNIGO"
                    width={128}
                    height={64}
                    className="w-32 h-16 mr-2 object-contain"
                  />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Exam Portal
                </h1>
                <p className="text-red-100 text-sm">
                  Student Verification System
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                Conducted by{" "}
                <span className="font-semibold text-gray-800">
                  UNIGO Education Experts
                </span>
                , authorized partner of{" "}
                <span className="font-semibold text-gray-800">Laurea UAS</span>
              </p>
            </div>

            <div className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 ml-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 ml-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-shake">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-700 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Identity</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Secure verification system</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
