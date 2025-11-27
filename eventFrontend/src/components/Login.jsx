import React, {useState} from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import { useEventContext, useUserContext } from '../contexts';
import axiosInstance from '../utils/axiosInstance.js';
import toast from 'react-hot-toast';
function Login({type}) {
    const {setIsLoggedIn, setUsername} = useUserContext();
    const {setEvents, setTickets} = useEventContext();
    const [usernameLocal, setUsernameLocal] = useState("");
    const [password, setPassword] = useState("");
    const navigate= useNavigate();

    const getUserDetails = async () => {
        try {
          if(type === 'org') {
            const res1 = await axiosInstance.get("/event/user-events");
            const response1 = await res1.data.data;
            const result = Object.keys(response1).length === 0 && response1.constructor === Object ? [] : response1;
            setEvents(result || []);
            console.log("got user events!");
          }
          else if(type == 'usr') {
            const res1 = await axiosInstance.get("/ticket/get-tickets");
            const response1 = await res1.data.data;
            const result = Object.keys(response1).length === 0 && response1.constructor === Object ? [] : response1;
            setTickets(result || []);
            console.log("got user tickets!");
          }
        } catch (error) {
          console.log("User not logged in (403)", error);
          setIsLoggedIn(false);
          setUsername("");
        }
    };
    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/user/login", {
                username: usernameLocal+type,
                password
            });
            const response = res.data.data;
            setUsername(response.username);
            setIsLoggedIn(true);
            await getUserDetails();
            navigate("/home");
            toast.success("Successfully logged in!");
        } catch (error) {
            const backendMessage = error.response?.data?.message;
              if(backendMessage === "Invalid password" || backendMessage === "User not found") {
                toast.error(backendMessage);
              }
              else {
                console.log("something went wrong while logging in the user.");
                toast.error("something went wrong while logging in the user.");
              }
        }
    }
  return (
    <form onSubmit={loginUser} className="flex flex-col gap-3 flex-wrap justify-evenly bg-gray-800 text-gray-300 text-lg mx-4 p-6 rounded-lg w-full shadow-lg border border-gray-700">
        <h1 className="text-center text-2xl font-semibold text-purple-400 mb-2">{type=='usr'? "User Login" : "Organiser Login"}</h1>
        <label htmlFor='username' className="font-medium">Username</label>
        <input
        type="text"
        required={true}
        value={usernameLocal}
        onChange={(e) => setUsernameLocal(e.target.value)}
        className="border border-gray-600 bg-gray-700 rounded px-3 py-2 focus:ring-purple-500 focus:ring-2 focus:border-purple-500 outline-none text-gray-200 w-full"
        />
        <label htmlFor='password' className="font-medium">Password</label>
        <input
        type="password"
        required={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-600 bg-gray-700 rounded px-3 py-2 focus:ring-purple-500 focus:ring-2 focus:border-purple-500 outline-none text-gray-200 w-full"
        />
        <button type="submit" className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white font-medium py-2 mt-2 rounded-md transition duration-200 shadow-md">Login</button>
        <p className="text-center text-gray-400">Don't have an account? <NavLink to='/signUp' className="text-purple-400 hover:text-purple-300">Sign Up</NavLink></p>
    </form>
  )
}

export default Login;