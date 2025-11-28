import './App.css'
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import {Login, SignUp, Home, MyTickets, Profile, MyEvents, MyTicketsView} from "./components/index.js";
import { UserProvider } from './contexts/UserContext.js';
import {EventProvider} from './contexts/EventContext.js'
import Layout from './Layout.jsx';
import { useEffect, useState } from 'react';
import Event from './components/Event.jsx';
import axiosInstance from './utils/axiosInstance.js';
import EmailVerificationPage from './components/EmailVerificationPage.jsx';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [launchedEvents, setLaunchedEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);

  const resetUserDetails = async () => {
    try {
      await axiosInstance.post("/user/logout-user");
      setUsername("");
      setIsLoggedIn(false);
      setEvents([]);
      setTickets([]);
      toast.success('Successfully logged out!');
    } catch (error) {
      toast.error('Something went wrong while logging out!');
      console.log("Something went wrong while logging out the user!\n", error);
    }
  }
  
  const getLaunchedEvents = async () => {
    try {
      const res = await axiosInstance.get("/event/launched-events");
      const response = await res.data.data;
      setLaunchedEvents(response);
    } catch (error) {
      console.log("Something went wrong while fetching launched events!", error);
      toast.error('Something went wrong while fetching events!');
    }
  }

  const getUserDetails = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/user/user-details"); //TODO: maybe plan to just send the username from backend
        const response = await res.data.data;

        setIsLoggedIn(true);
        setUsername(response.username);
        
        if(response.username.endsWith("org")) {
          const res1 = await axiosInstance.get("/event/user-events");
          const response1 = await res1.data.data;
          const result = Object.keys(response1).length === 0 && response1.constructor === Object ? [] : response1;
          console.log(result);
          setEvents(result || []);
        }
        else if(response.username.endsWith("usr")) {
          const res1 = await axiosInstance.get("/ticket/get-tickets");
          const response1 = await res1.data.data;
          const result = Object.keys(response1).length === 0 && response1.constructor === Object ? [] : response1;
          setTickets(result || []);
          console.log(result);
        }
      } catch (error) {
        console.log(error);
        if (error.code === "ERR_NETWORK") {
          console.warn("Network error - likely due to proxy. Skipping toast.");
        }
        else if (error.response?.status === 407) {
          console.log("User not logged in");
          setIsLoggedIn(false);
          setUsername("");
        } else {
          console.log("Unexpected error while getting user details:", error);
          toast.error('Something went wrong!');
        }
      } finally {
        setLoading(false);
      }
  };

  function formatForDateTimeLocalInput(dateStringFromBackend) {
  const date = new Date(dateStringFromBackend); // backend gives UTC
  const offset = date.getTimezoneOffset();
  const localTime = new Date(date.getTime() - offset * 60000);
  return localTime.toISOString().slice(0, 16); // local yyyy-MM-ddTHH:mm
}


    useEffect(() => {
        console.log("app rendered!");
        getLaunchedEvents();
        getUserDetails();
    }, []);

  const createEvent = async (event) => {
    try {
      const res = await axiosInstance.post("/event/create-event", event);
      const response = await res.data.data;
      response.dateTime = formatForDateTimeLocalInput(response.dateTime);
      setEvents(prev => [...prev, {...response}]); 
      toast.success('successfully created an event!');
      return true;
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message;
      console.log("Something went wrong while creating an event", backendMessage);
      toast.error(backendMessage);
      return false;
    }

    // setEvents((prev) => (
    //   prev.push({eventId: dateNow, ...event})
    //shouldn't do state mutation
    // ));
  }


  //TODO: make a route for launching an event rather than considering it as editing an event!
  const launchEvent = async (event) => {
    try {
      event.eventLaunched = true;
      let launchedEvent = await axiosInstance.patch("/event/edit-event",event);
      launchedEvent = await launchedEvent.data.data;
      launchedEvent.dateTime = formatForDateTimeLocalInput(launchedEvent.dateTime);
      setLaunchedEvents(prev => [...prev, {...launchedEvent}]);
      toast.success('successfully launched the event!');
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message;
      console.log("Something went wrong while launching an event", backendMessage);
      toast.error('Something went wrong while launching the event')
    }
  }

  const deleteEvent = async (deleteEventId) => {
    try {
      const eventId = deleteEventId;
      await axiosInstance.delete("/event/delete-event",{data: { eventId }});
      setEvents(prevEvents => prevEvents.filter(event => event.eventId !== deleteEventId));
      setLaunchedEvents(prevlaunchedEvents => prevlaunchedEvents.filter(event => event.eventId !== deleteEventId));
      toast.success("Successfully deleted the event!");
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message;
      console.log("Something went wrong while deleting an event", backendMessage);
      toast.error(backendMessage);
    }
  }

  const editEvent = async (event) => {
    try {
      const res = await axiosInstance.patch("/event/edit-event", event);
      const response = await res.data.data;
      response.dateTime = formatForDateTimeLocalInput(response.dateTime);
      setEvents(prev => prev.map(prevEvent => prevEvent.eventId === event.eventId ? response : prevEvent));
      toast.success('Successfully edited the event!');
      return true;
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message;
      console.log("Something went wrong while editing an event", backendMessage);
      toast.error(backendMessage);
      return false;
    }
  }

  const joinEvent = async (eventId) => {
    try {
      const res = await axiosInstance.post("/ticket/register-event",{eventId: eventId});
      const response = res.data.data;
      setTickets(prev => [...prev, response]);
      console.log("Successfully joined!");
      console.log(response);
      toast.success('Successfully joined!');
    } catch (error) {
     const message = error.response?.data?.message; 
     console.log(message);
     toast.error(message);
    }
  }

  const deleteTicket = async (index) => {
    try {
      await axiosInstance.patch("/ticket/delete-ticket", {ticketCode: tickets[index].ticketCode})
      setTickets(prev => prev.filter((_, i) => i !== index));
      toast.success('successfully deleted the ticket!');
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Something went wrong!"; 
     console.log(message);
     toast.error(message);
    }
  }

  return (
    <EventProvider value={{events, createEvent, launchEvent, setEvents, deleteEvent, editEvent, joinEvent, tickets, setTickets, deleteTicket}}>
      <UserProvider value={{username, isLoggedIn, setIsLoggedIn, setUsername, resetUserDetails, loading, setLoading}}>
          <Toaster toastOptions={{
    success: {
      style: {
        background: 'green',
        color: 'white',
      },
    },
    error: {
      style: {
        background: 'crimson',
        color: 'white',
      },
    },
    style: {
      background: '#333', // fallback style for normal toasts
      color: '#fff',
    },
  }}position="top-center" reverseOrder={false} />
          <BrowserRouter> {/*changed from createBrowserRouter to browser router because createbrowser router won't allow dynamic routes, which we want for different event pages*/}
          <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='' element={
              <div className="flex flex-col md:flex-row w-full gap-8 p-6 bg-gray-900 min-h-[80vh] items-center justify-center relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-indigo-600/5 rounded-full blur-lg"></div>
                
                {/* Content container */}
                <div className="z-10 flex flex-col md:flex-row gap-8 w-full max-w-8xl">
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Event Management System</h1>
                    <p className="text-gray-300 text-center mb-6">Your complete solution for event planning, ticketing, and management. Sign in to get started.</p>
                    <div className="w-full">
                      <Login type="org" />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-semibold text-white mb-4 text-center">Attending an Event?</h2>
                    <p className="text-gray-300 text-center mb-6">Log in to access your tickets, view upcoming events, and manage your profile.</p>
                    <div className="w-full">
                      <Login type="usr" />
                    </div>
                  </div>
                </div>
              </div>
              } />
            <Route path='signUp' element={
              <div className="flex flex-col md:flex-row w-full gap-8 p-6 bg-gray-900 min-h-[80vh] items-center justify-center relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-indigo-600/5 rounded-full blur-lg"></div>
                
                {/* Content container */}
                <div className="z-10 flex flex-col md:flex-row gap-8 w-full max-w-8xl">
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Create an Account</h1>
                    <p className="text-gray-300 text-center mb-6">Register as an event organizer to create and manage your own events.</p>
                    <div className="w-full">
                      <SignUp type="org" />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-semibold text-white mb-4 text-center">Attendee Registration</h2>
                    <p className="text-gray-300 text-center mb-6">Sign up to discover events, purchase tickets, and join the community.</p>
                    <div className="w-full">
                      <SignUp type="usr" />
                    </div>
                  </div>
                </div>
              </div>
              } />
            <Route path='home' element={<Home eventsToRender={launchedEvents} />} />
            <Route path='myTickets' element={<MyTickets eventsToRender={launchedEvents} />} />
            <Route path='profile' element={<Profile />}/>
            <Route path="myevents" element={<MyEvents />} />
            <Route path="events/:creator/:eventId" element={<Event events1={launchedEvents}  events2={events}/>} />
            <Route path="tickets/:index" element={<MyTicketsView eventsToRegister={launchedEvents} />} />
            <Route path="verify-email/:verificationId" element={<EmailVerificationPage />} />
          </Route>
          </Routes>
          </BrowserRouter>
      </UserProvider>
    </EventProvider>
  )
}

export default App