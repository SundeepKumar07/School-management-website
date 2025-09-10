'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const SignInPage = () => {
  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!isLoaded || !user) return
    const role = user?.publicMetadata?.role as string | undefined
    if (role) {
      router.push(`/${role}`)
    }else{
      return;
    }
  }, [user, router])

  return (
    <div className='flex justify-center items-center h-screen rounded-md'>
      <SignIn.Root>
        <SignIn.Step
          name='start'
          className='bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 w-md sm:w-sm'
        >
          <div className='flex gap-4'>
            <Image src={'/logo.png'} alt='logo' width={30} height={30} />
            <h1 className='text-2xl font-semibold'>DevSchool</h1>
          </div>
          <h2 className='text-sm text-gray-600'>Enter credentials to Sign in</h2>

          <Clerk.GlobalError />
          <Clerk.Field name='identifier' className='flex flex-col gap-2'>
            <Clerk.Label className='text-sm font-semibold'>Username</Clerk.Label>
            <Clerk.Input type='text' className='rounded-lg py-2 px-1 outline-none ring-1 ring-gray-400' required />
            <Clerk.FieldError className='text-xs text-red-500' />
          </Clerk.Field>

          <Clerk.Field name='password' className='flex flex-col gap-2'>
            <Clerk.Label className='text-sm font-semibold'>Password</Clerk.Label>
            <Clerk.Input type='password' className='rounded-lg py-2 px-1 outline-none ring-1 ring-gray-400' required />
            <Clerk.FieldError className='text-xs text-red-500' />
          </Clerk.Field>

          <SignIn.Action
            submit
            className="relative isolate w-full rounded-lg bg-gradient-to-b from-blue-400 to-blue-500 px-3.5 py-2.5 text-center text-sm font-medium text-emerald-950 shadow-[0_1px_0_0_theme(colors.white/30%)_inset,0_-1px_1px_0_theme(colors.black/5%)_inset] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-white/10 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-white active:text-emerald-950/80 active:before:bg-black/10"
          >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}

export default SignInPage;