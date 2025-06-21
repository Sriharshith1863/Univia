import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
function SignUp({type}) {
        const [usernameLocal, setUsernameLocal] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [email, setEmail]  = useState("");
        const [phoneNumber, setPhoneNumber] = useState("");
        const [dob, setDob] = useState("");
        const navigate = useNavigate();

        const signUp = async (e) => {
            e.preventDefault();
            try {
              await axiosInstance.post("/user/signUp",{
                username: usernameLocal+type,
                password,
                dob,
                email,
                phoneNumber,
                confirmPassword
              });

              navigate("/");
              toast.success("Successfully signed up, now login to use your account!");
            } catch (error) {
              const backendMessage = error.response?.data?.message;
              if(!backendMessage) {
                toast.error("something went wrong while registering user.");
                console.log("something went wrong while registering user.");
              }
              else {
                if(backendMessage === "retype your password") {
                  toast.error(backendMessage);
                  setConfirmPassword("");
                }
                else {
                  toast.error(backendMessage);
                }
              }
            }
        }

  return (
      <form onSubmit={signUp} className="flex flex-col gap-3 justify-evenly bg-gray-800 flex-wrap text-gray-300 text-lg mx-4 p-6 rounded-lg w-full shadow-lg border border-gray-700">
        <h1 className="text-center text-2xl font-semibold text-purple-400 mb-2">{type=='usr'? "User Sign Up" : "Organiser Sign Up"}</h1>
        <label htmlFor='username' className="font-medium">Username</label>
        <input
        type="text"
        required={true}
        value={usernameLocal}
        onChange={(e) => setUsernameLocal(e.target.value)}
        className="border border-gray-600 bg-gray-700 rounded px-3 py-2 focus:ring-purple-500 focus:ring-2 focus:border-purple-500 outline-none text-gray-200"
        />
        <label htmlFor='password' className="font-medium">Password</label>
        <input
        type="password"
        required={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-600 bg-gray-700 rounded px-3 py-2 focus:ring-purple-500 focus:ring-2 focus:border-purple-500 outline-none text-gray-200"
        />
        <label htmlFor='confirmPassword' className="font-medium">Confirm Password</label>
        <input
        type="password"
        required={true}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border border-gray-600 bg-gray-700 rounded px-3 py-2 focus:ring-purple-500 focus:ring-2 focus:border-purple-500 outline-none text-gray-200"
        />
        <label htmlFor='dob' className="font-medium">Date of birth</label>
        <input
        type="date"
        required={true}
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="border border-gray-600 bg-gray-700 rounded px-3 py-2 focus:ring-purple-500 focus:ring-2 focus:border-purple-500 outline-none text-gray-200"
        />
        <label htmlFor='email' className="font-medium">Email</label>
        <input
        type="email"
        required={true}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-600 bg-gray-700 rounded px-3 py-2 focus:ring-purple-500 focus:ring-2 focus:border-purple-500 outline-none text-gray-200"
        />
        <label htmlFor='phoneNumber' className="font-medium">Phone Number</label>
        <input
        type="tel"
        required={true}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border border-gray-600 bg-gray-700 rounded px-3 py-2 focus:ring-purple-500 focus:ring-2 focus:border-purple-500 outline-none text-gray-200"
        />
        <button type="submit" className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white font-medium py-2 mt-2 rounded-md transition duration-200 shadow-md">Sign Up</button>
    </form>
  )
}

export default SignUp;