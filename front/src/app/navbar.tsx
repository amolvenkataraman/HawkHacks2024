'use client'

import { useRedirectFunctions } from '@propelauth/react'
import { GetAuth } from './authinfo';


export default function Navbar() {
  const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions();

  return (
    <nav className="p-4">
      <div className="container mx-auto">
        <a href="/" className="font-bold text-xl">HawkHacks2024</a>
        <div className="flex space-x-4">
          <button onClick={() => location.href = '/'} className="">Home</button>
          <button onClick={() => redirectToLoginPage()} className="">Login</button>
          <button onClick={() => redirectToSignupPage()} className="">Sign up</button>
          <button onClick={() => redirectToAccountPage()} className="">Account</button>
          <button onClick={() => location.href = '/annotate'} className="">Annotate</button>
        </div>
        <GetAuth />
      </div>
    </nav>
  );
}
