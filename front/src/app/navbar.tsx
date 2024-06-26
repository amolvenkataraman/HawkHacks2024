'use client'

import { useAuthInfo, withAuthInfo, useLogoutFunction, useRedirectFunctions, useHostedPageUrls } from '@propelauth/react'

function UserInfo() {
  const authInfo = useAuthInfo();
  const logoutFunction = useLogoutFunction();
  const { getLoginPageUrl, getSignupPageUrl, getAccountPageUrl } = useHostedPageUrls()

  // console.log(authInfo)
  if (authInfo.loading) {
    return (
      <div className="nav-element min-w-60 space-x-6 flex justify-end">
        <i>Loading...</i>
      </div>
    )
  } else if (authInfo.isLoggedIn) {
    return (
      <div className="nav-element min-w-60 space-x-6 flex justify-end">
        <a href={getAccountPageUrl()}>{authInfo.user.email}</a>
        <button onClick={() => logoutFunction(true)} className="">Logout</button>
      </div>
    )
  } else {
    return (
      <div className="nav-element min-w-60 space-x-6 flex justify-end">
        <a href={getLoginPageUrl()}>Login</a>
        <a href={getSignupPageUrl()}>Sign up</a>
      </div>
    )
  }
}

export default function Navbar() {
  return (
    <nav className="p-4 flex justify-between">
      <div className="nav-element min-w-60">
        <a href="/" className="font-bold text-xl">DataSrc</a>
      </div>
      <div className="flex space-x-5">
        <button onClick={() => location.href = '/annotate'} className="">Annotate</button>
        <button onClick={() => location.href = '/admin'} className="">Create Job</button>
      </div>
        <UserInfo />
    </nav>
  );
}
