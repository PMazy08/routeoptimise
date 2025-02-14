import React, { useState } from "react";

const AddSchoolModal = ({ isOpen, closeModal }) => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  if (!isOpen) return null; // ถ้า modal ไม่เปิด ไม่แสดงอะไรเลย

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-50 p-6 shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          Add Location School
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Longitude:
            </label>
            <input
              type="text"
              id="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)} // อัปเดต state email
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Latitude:
            </label>
            <input
              type="text"
              id="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)} // อัปเดต state email
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Save
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

export default AddSchoolModal;
