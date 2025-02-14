import React from 'react';

const NotificationModal = ({ type, msg }) => {
  return (
    <div
      className={`fixed top-4 right-0 p-4 text-sm w-[500px] 
        ${type === "success"
          ? "text-green-800 bg-green-50"
          : type === "danger"
            ? "text-red-800 bg-red-50"
            : type === "warning"
              ? "text-yellow-800 bg-yellow-50"
              : "text-gray-800 bg-gray-50"} 
        rounded-lg shadow-lg`}
      role="alert"
    >
      <span className="font-medium">{msg}</span>
    </div>
  );
};

export default NotificationModal;
