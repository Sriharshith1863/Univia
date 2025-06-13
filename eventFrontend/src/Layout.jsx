import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import { useUserContext } from './contexts'
import { LoadingPage } from './components';

function Layout() {
  const {loading} = useUserContext();
  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-gray-900 text-gray-200">
        <Header />
        <main className="flex-grow">
          {!loading && <Outlet />}
          {loading && <LoadingPage />}
        </main>
        <footer className="bottom-0 p-4 text-center bg-gray-800 text-gray-400 border-t border-gray-700">
            Website footer
        </footer>
    </div>
  )
}

export default Layout