import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts'
import axiosInstance from '../utils/axiosInstance.js';
import FileUploader from './FileUploader.jsx';
import toast from 'react-hot-toast';

function Profile() {
  const { username, isLoggedIn, setIsLoggedIn, setUsername } = useUserContext();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [dob, setDob] = useState("");
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("https://res.cloudinary.com/dk4prfm7s/image/upload/v1750942873/Image_not_available_hnbucy.png");

  const getUserDetails = async () => {
    const res = await axiosInstance.get("/user/user-details");
    const response = await res.data.data;
    const dateOnly = new Date(response.dob).toISOString().split('T')[0];
    setEmail(response.email);
    setPhoneNumber(response.phoneNumber);
    setDob(dateOnly);
    setIsLoggedIn(true);
    setUsername(response.username);
    setAvatar(response.avatar);
  };

  useEffect(() => {
    try {
      getUserDetails();
    } catch (error) {
      toast.error("Something went wrong while fetching your details!");
      console.log("Something went wrong while fetching user details!", error);
      if (!isLoggedIn) {
      navigate('/signUp');
    }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const handleUploadResult = (avatarUrl) => {
  setAvatar(avatarUrl);
}

  const editProfile = async (e) => {
    e.preventDefault();
    if (isEditable) {
      try {
        //TODO: make even username editable
        const res = await axiosInstance.post("/user/profile",{
          email,
          phoneNumber,
          dob
        });
        const response = res.data.data;
        const dateOnly = new Date(response.dob).toISOString().split('T')[0];
        setEmail(response.email);
        setDob(dateOnly);
        setPhoneNumber(response.phoneNumber);

        setIsEditable(false);
        toast.success("Profile successfully edited!");
      }

      catch (error) {
        const backendMessage = error.response?.data?.message;
        if(backendMessage === "No field should be empty!" || backendMessage === "User not found!") {
          toast.error(backendMessage);
        }
        else {
          toast.error("Something went wrong...");
        }
      }
    }
    else {
      setIsEditable((prev) => !prev);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-8xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-400">User Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="relative group">
              <img 
                src={avatar} 
                alt="avatar" 
                className="h-70 w-80 rounded-xl object-cover border-4 border-indigo-500/50"
              />
            </div>
            <FileUploader onUploadSuccess={handleUploadResult}/>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <form 
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden" 
              onSubmit={editProfile}
            >
              {/* Header with Edit Button */}
              <div className="flex items-center justify-between bg-gray-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-indigo-300">Personal Information</h2>
                <button
                  type="submit"
                  className={`px-4 py-2 cursor-pointer rounded-lg font-medium shadow-md transition-colors duration-200
                    ${isEditable 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                >
                  {isEditable ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-400">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username.substring(0, username.length-3)}
                    readOnly={true}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 focus:outline-none"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                    placeholder="example@email.com"
                    readOnly={!isEditable}
                    required={true}
                    className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg text-gray-300 focus:outline-none transition-colors duration-200
                      ${isEditable 
                        ? "border-indigo-500 focus:ring-2 focus:ring-indigo-500/50" 
                        : "border-gray-600"}`}
                  />
                </div>

                {/* Date of Birth Field */}
                <div className="space-y-2">
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-400">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => {setDob(e.target.value)}}
                    readOnly={!isEditable}
                    required={true}
                    className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg text-gray-300 focus:outline-none transition-colors duration-200
                      ${isEditable 
                        ? "border-indigo-500 focus:ring-2 focus:ring-indigo-500/50" 
                        : "border-gray-600"}`}
                  />
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {setPhoneNumber(e.target.value)}}
                    placeholder="1234567890"
                    readOnly={!isEditable}
                    required={true}
                    className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg text-gray-300 focus:outline-none transition-colors duration-200
                      ${isEditable 
                        ? "border-indigo-500 focus:ring-2 focus:ring-indigo-500/50" 
                        : "border-gray-600"}`}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile