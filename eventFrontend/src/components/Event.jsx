import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventContext, useUserContext } from '../contexts';

function Event({ events1, events2 }) {
  const { creator, eventId } = useParams();
  const {joinEvent, tickets} = useEventContext();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const {username} = useUserContext();
  useEffect(() => {
    const index = tickets.findIndex(element => element.registrationId.eventId === eventId);
    setIsRegistered(index !== -1);
    if(username.endsWith("org")) {
      setIsUser(false);
    }
  }, [eventId, tickets, username]);

  let eventToRender = events1.find(event =>
    event.eventId === eventId && event.eventCreater === creator
  );

  if (!eventToRender) {
    eventToRender = events2.find(event =>
      event.eventId === eventId && event.eventCreater === creator
    );
  }
  if (!eventToRender) return <div>Event not found</div>;

  const event = eventToRender || {
    eventName: "Event Name",
    description: "No description available",
    venue: "Not specified",
    dateTime: "Not specified",
    organiserName: "Not specified",
    contact1: "Not specified",
    contact2: "Not specified",
    organiserEmailId: "Not specified",
    imageUrl: "https://res.cloudinary.com/dk4prfm7s/image/upload/v1750942873/Image_not_available_hnbucy.png"
  };
  console.log(event);
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="w-full px-4 py-8">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left side - Event information */}
          <div className="w-full lg:w-3/5 pr-0 lg:pr-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-indigo-400 mb-4 break-words">{event.eventName}</h1>
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
                <p className="text-gray-300 text-lg mb-6 leading-relaxed break-words whitespace-normal">{event.description}</p>
                <div className="space-y-6 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-medium text-white">Venue</h2>
                      <p className="text-gray-300 text-lg break-words">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-medium text-white">Date and Time</h2>
                      <p className="text-gray-300 text-lg break-words">{event.dateTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-2xl font-semibold text-indigo-300 mb-6">Organiser Details</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-white">Organiser</h3>
                    <p className="text-gray-300 text-lg break-words">{event.organiserName}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-white">Primary Contact</h3>
                    <p className="text-gray-300 text-lg break-words">{event.contact1}</p>
                  </div>
                </div>
                {event.contact2 && event.contact2 !== "Not specified" && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-medium text-white">Secondary Contact</h3>
                      <p className="text-gray-300 text-lg break-words">{event.contact2}</p>
                    </div>
                  </div>
                )}
                {event.organiserEmailId && event.organiserEmailId !== "Not specified" && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-medium text-white">Email</h3>
                      <p className="text-gray-300 text-lg break-words">{event.organiserEmailId}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right side - Event image */}
          <div className="w-full lg:w-2/5 mt-8 lg:mt-0">
            <div className="sticky top-8">
              <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700 h-full">
                <img 
                  src={event.imageUrl} 
                  alt={event.eventName}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div>
                <button
                onClick={() => joinEvent(event.eventId)}
                disabled={!isUser || isRegistered}
                className='mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300'>
                {isUser? isRegistered? "Joined" : "Register" : "Only for Users"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;