import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function EmailVerificationPage() {
    const [otp, setOtp] = useState("");
    const {verificationId} = useParams();
    const navigate = useNavigate();
    const verifyUser = async (e) => {
        console.log("before request");
        e.preventDefault();
        try {
             await axiosInstance.post("/user/signUp",{verificationId: verificationId, otp: otp});
             console.log("after request");
             toast.success("Registration successfully completed!");
             toast.success("Redirecting you to Login page");
             navigate("/");
             console.log("Successfully created an user");
        } catch (error) {
            let message = "Something went wrong!";
            message = error?.response?.data?.message || error?.message || message;
            console.log(message);
            if(message === "Your verification session has expired. Please sign up again") {
                toast.error(message);
                setOtp("");
                navigate("/signUp");
            }
            else if(message === "Incorrect otp") {
                toast.error(message);
                setOtp("");
            }
            else {
                toast.error("Something went wrong while registering the user, Please SignUp again");
                navigate("/signUp");
            }
        }
        console.log("after request");
    }

  return (
    <form
  className="flex flex-col gap-4 bg-gray-800 text-gray-300 text-lg mx-auto p-8 rounded-xl w-full max-w-xl shadow-lg border border-gray-700"
  onSubmit={verifyUser}
>
  <h2 className="text-2xl font-semibold text-center text-white mb-2">Enter OTP</h2>

  <label htmlFor="otp" className="font-medium">
    One-Time Password
  </label>
  <input
    type="text"
    id="otp"
    required
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
    placeholder="Enter the 6-digit code"
    className="border border-gray-600 bg-gray-700 rounded px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-200 transition"
  />

  <button
    type="submit"
    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition duration-200"
  >
    Verify OTP
  </button>
</form>

  )
}

export default EmailVerificationPage;