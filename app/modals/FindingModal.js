// LoadingOverlay.js
// import React from 'react';
// import '../modals/styles/findingoverlay.css';

// const LoadingOverlay = () => {
//   return (
//     <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
//       <div className="bg-white border py-2 px-5 rounded-lg flex items-center flex-col">
//         <div className="loader-dots block relative w-20 h-5 mt-2">
//           <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
//           <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
//           <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
//           <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
//         </div>
//         <div className="text-gray-500 text-xs font-medium mt-2 text-center">
//           Finding Routes...
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoadingOverlay;

// LoadingOverlay.js
import React, { useState } from 'react';
import '../modals/styles/findingoverlay.css';

const LoadingOverlay = ({ onCancel }) => {
  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-gray-800 bg-opacity-30">
      <div className="bg-white border py-2 px-5 rounded-lg flex items-center flex-col">
        <div className="loader-dots block relative w-20 h-5 mt-2">
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-500 text-xs font-medium mt-2 text-center">
          Finding Routes...
        </div>
        {/* <button 
          onClick={onCancel} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button> */}
      </div>
    </div>
  );
};

export default LoadingOverlay;

