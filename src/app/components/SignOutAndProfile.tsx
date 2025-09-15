'use client';

import { useClerk, UserButton } from "@clerk/nextjs";
import Image from "next/image";

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
    <button onClick={() => signOut({ redirectUrl: '/' })}>
      <Image src={'/logout.png'} alt="icon" width={20} height={20} />
    </button>
  )
}
