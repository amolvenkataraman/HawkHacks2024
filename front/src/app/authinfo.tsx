import { type WithAuthInfoProps, withAuthInfo } from '@propelauth/react'

export const GetAuth = withAuthInfo((props: WithAuthInfoProps) => {
  // isLoggedIn and user are injected automatically from withAuthInfo
  if (props.isLoggedIn) {
    return <p>You are logged in as {props.user.email}</p>
  } else {
    return <p>You are not logged in</p>
  }
})
