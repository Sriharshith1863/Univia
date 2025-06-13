import React, {useState} from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import { useEventContext, useUserContext } from '../contexts';
import axiosInstance from '../utils/axiosInstance';
function Login({type}) {
    //TODO: remove the username and setUsername if it is not needed
    // eslint-disable-next-line no-unused-vars
    const {username, setIsLoggedIn, setUsername} = useUserContext();
    const {setEvents} = useEventContext();
    const [usernameLocal, setUsernameLocal] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate= useNavigate();

        const getUserDetails = async () => {
        try {
          if(type === 'org') {
            const res1 = await axiosInstance.get("/event/user-events");
            const response1 = await res1.data.data;
            const result = Object.keys(response1).length === 0 && response1.constructor === Object ? [] : response1;
            console.log(result);
            setEvents(result || []);
            console.log("got user events!");
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
            console.log(response);
            setUsername(response.username);
            setIsLoggedIn(true);
            await getUserDetails();
            navigate("/home");
            setErrorMessage("");
        } catch (error) {
            const backendMessage = error.response?.data?.message;
              if(backendMessage === "Invalid password" || backendMessage === "User not found") {
                setErrorMessage(backendMessage);
              }
              else {
                console.log("something went wrong while logging in the user.");
                setErrorMessage("something went wrong while logging in the user.");
              }
        }

        // const checkUser = localStorage.getItem(usernameLocal+type);
        // const userDetails = JSON.parse(checkUser);
        // if(!checkUser) {
        //     setErrorMessage("Invalid username or password");
        //     setUsernameLocal("");
        //     setPassword("");
        //     return;
        // }
        // else if(userDetails.password !== password) {
        //     setErrorMessage("Incorrect password");
        //     setPassword("");
        //     return;
        // }
        // setUsername(usernameLocal+type);
        // navigate("/home");
        // setIsLoggedIn(true);
        // setErrorMessage("");
    }
  return (
    <form onSubmit={loginUser} className="flex flex-col gap-3 flex-wrap justify-evenly bg-gray-800 text-gray-300 text-lg mx-4 p-6 rounded-lg w-full shadow-lg border border-gray-700">
        <h1 className="text-center text-2xl font-semibold text-purple-400 mb-2">{type=='usr'? "User Login" : "Organiser Login"}</h1>
        {errorMessage && <p className="text-red-400 bg-red-900/20 p-2 rounded">{errorMessage}</p>}
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