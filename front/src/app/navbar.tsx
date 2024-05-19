'use client'

import { useLogoutFunction, useRedirectFunctions } from '@propelauth/react'


export default function Navbar() {
  const logoutFunction = useLogoutFunction();
  const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions();

  return (
    <nav className="p-4 flex justify-between">
      <div className="nav-element min-w-60">
        <a href="/" className="font-bold text-xl">HawkHacks2024</a>
      </div>
      <div className="flex space-x-4">
        <button onClick={() => location.href = '/'} className="">Home</button>
        <button onClick={() => redirectToLoginPage()} className="">Login</button>
        <button onClick={() => redirectToSignupPage()} className="">Sign up</button>
        <button onClick={() => redirectToAccountPage()} className="">Account</button>
        <button onClick={() => logoutFunction(true)} className="">Logout</button>
        <button onClick={() => location.href = '/annotate'} className="">Annotate</button>
        <button onClick={() => location.href = '/admin'} className="">Admin</button>
      </div>
      <div className="nav-element min-w-60 flex justify-end">
        {/* <GetAuth /> */}
        You must be logged in
      </div>
    </nav>
  );
}
