'use client'

import { useLogoutFunction, useRedirectFunctions, useAuthInfo } from '@propelauth/react'

function UserInfo() {
  const authInfo = useAuthInfo();
  const logoutFunction = useLogoutFunction();
  const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions();

  if (authInfo.loading) {
    return (
      <div className="nav-element min-w-60 space-x-4 flex justify-end">
        Loading...
      </div>
    )
  } else if (authInfo.isLoggedIn) {
    return (
      <div className="nav-element min-w-60 space-x-4 flex justify-end">
        Loading...
        <div>Welcome, {authInfo.user.email}!</div>
        <button onClick={() => redirectToAccountPage()} className="">Account</button>
        <button onClick={() => logoutFunction(true)} className="">Logout</button>
      </div>
    )
  } else {
    return (
      <div className="nav-element min-w-60 space-x-4 flex justify-end">
        <button onClick={() => redirectToLoginPage()} className="">Login</button>
        <button onClick={() => redirectToSignupPage()} className="">Sign up</button>
      </div>
    )
  }
  return "LOL"
}

export default function Navbar() {
  const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions();

  return (
    <nav className="p-4 flex justify-between">
      <div className="nav-element min-w-60">
        <a href="/" className="font-bold text-xl">HawkHacks2024</a>
      </div>
      <div className="flex space-x-4">
        <button onClick={() => location.href = '/'} className="">Home</button>
        <button onClick={() => location.href = '/annotate'} className="">Annotate</button>
        <button onClick={() => location.href = '/admin'} className="">Admin</button>
      </div>
        <UserInfo />
    </nav>
  );
}
