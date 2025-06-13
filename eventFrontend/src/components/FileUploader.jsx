import React from 'react'
import { useRef} from 'react';
import axiosInstance from '../utils/axiosInstance';
function FileUploader({ onUploadSuccess }) {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await axiosInstance.post("/user/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
       console.log("Upload success!");
       if(onUploadSuccess) {
        onUploadSuccess(res.data.data.avatar);
       }
    } catch (error) {
      console.log("Upload failed: ", error.response?.data?.message);
    }
  }

  const triggerFilePicker = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-6 shadow-lg">
      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md cursor-pointer"
        onClick={triggerFilePicker}
      >
        Upload Photo
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

export default FileUploader;