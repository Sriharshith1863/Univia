import React from 'react'
import { NavLink } from 'react-router-dom'
import { useUserContext } from '../contexts';

function Header() {
  const { isLoggedIn, username, resetUserDetails } = useUserContext();
  const isUser = username?.endsWith('usr');

  const linkBase = 'transition-colors duration-200 hover:text-purple-400';
  const activeClass = 'text-purple-400 font-semibold';
  const inactiveClass = 'text-gray-400';

  return (
    <header className="bg-gray-900 text-white flex justify-between items-center p-4 shadow-md">
      <h1 className="text-3xl font-bold tracking-wide text-purple-500"> Event Sphere</h1>

      <nav className="flex flex-wrap gap-x-6 text-lg font-medium">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Home
        </NavLink>

        {isLoggedIn && isUser && (
          <NavLink
            to="/myTickets"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            My Tickets
          </NavLink>
        )}

        {isLoggedIn && !isUser && (
          <NavLink
            to="/myEvents"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            My Events
          </NavLink>
        )}

        {isLoggedIn && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Profile
          </NavLink>
        )}

        {!isLoggedIn && (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/signUp"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Sign Up
            </NavLink>
          </>
        )}

        {isLoggedIn && (
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
            onClick={resetUserDetails}
          >
            Logout
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Header;
