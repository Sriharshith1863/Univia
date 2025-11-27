import React from 'react'
import { useRef} from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import toast from 'react-hot-toast';
function EventImageUploader({eventId}) {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("eventImage", file);
    formData.append("eventId", eventId);
    try {
      await axiosInstance.patch("/event/event-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
       console.log("Upload success!");
       toast.success("Successfully updated profile photo");
       window.location.reload();
    } catch (error) {
      toast.error("Upload failed");
      console.log("Upload failed: ", error.response?.data?.message);
    }
  }

  const triggerFilePicker = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <div className="flex items-center justify-center bg-gray-800 rounded-xl shadow-lg">
      <button
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md cursor-pointer"
        onClick={triggerFilePicker}
      >
        Update cover Image
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
    </div>
  )
}

export default EventImageUploader;