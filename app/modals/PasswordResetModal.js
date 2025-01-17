// PasswordResetModal.js

import React from "react";

const PasswordResetModal = ({
  isOpen,
  email,
  setEmail,
  handlePasswordResetRequest,
  closeModal,
}) => {
  if (!isOpen) return null; // ถ้า modal ไม่เปิด ไม่แสดงอะไรเลย

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-50 p-6 shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          Reset Password
        </h2>
        <form onSubmit={handlePasswordResetRequest} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your email address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={closeModal}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
