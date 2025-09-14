'use client';

import { useClerk, UserButton } from "@clerk/nextjs";

export const SignOutAndProfile = () => {
  return (
    <div>
        <UserButton afterSignOutUrl="/sign-in" />
    </div>
  )
}

export const SignOutButton = () => {
  const { signOut } = useClerk()

  return (
    // Clicking this button signs out a user
    // and redirects them to the home page "/".
    <button onClick={() => signOut({ redirectUrl: '/' })}>logout</button>
  )
}
