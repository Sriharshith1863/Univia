import React, { useEffect, useMemo} from 'react';
import { useEventContext, useUserContext } from '../contexts';
import { useNavigate } from 'react-router-dom';

function MyTickets({eventsToRender}) {
  const { isLoggedIn } = useUserContext();
  const navigate = useNavigate();
  const {tickets, deleteTicket} = useEventContext();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  const eventMap = useMemo(() => {
  const map = {};
  eventsToRender.forEach(event => {
    map[String(event.eventId)] = event;
  });
  return map;
}, [eventsToRender]);

let count = 0;
    for(const ticket of tickets) {
      if(ticket.toDisplay === true) {
        count++;
      }
    }
  const renderedTickets = useMemo(() => {
    console.log(tickets);
    return (
      <div className="space-y-4 mt-8 w-full">
        {tickets.length === 0 ? (
          <div className="text-center py-10 bg-gray-800 rounded-xl border border-gray-700 w-full">
            <p className="text-gray-400 text-lg">No events joined in yet</p>
            <p className="text-gray-500 mt-2">Join an event to see your ticket here</p>
          </div>
        ) : count == 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-600 rounded-xl text-gray-400 w-full">
          <p className="text-lg">Your tickets list is currently empty</p>
          <p className="text-gray-500 mt-2">Join new events to see tickets here again</p>
        </div>
        ) : (
          tickets.map((ticket, index) => {
            const event = eventMap[String(ticket.registrationId.eventId)];
            if(!event) {
              return null;
            }
            if(ticket.toDisplay === false) {
              return null;
            }

            return (
              <div 
              key={index} 
              className="bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-indigo-500 p-4 shadow-md transition-all duration-200 hover:shadow-lg hover:shadow-indigo-900/20 w-full"
            >
              <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold text-white">{event.eventName}</h3>
                  <p className="text-gray-400 text-lg">{event.venue} • {event.dateTime}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate(`/tickets/${index}`)} 
                    className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  {/*TODO: if it can be try to add a confirm delete form, "Do you really want to delete?"*/}
                  <button 
                    className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                    onClick={()=>{deleteTicket(index)}}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
                <div className="hidden md:block text-gray-500 hover:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets]);

  return (
    <>
      <div className="p-4">
        {renderedTickets}
      </div>
    </>
  );
}

export default MyTickets;
