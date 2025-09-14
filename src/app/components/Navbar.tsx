import React from 'react'
import Image from 'next/image'
// import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { SignOutAndProfile } from './SignOutAndProfile';
const Navbar = async ({type}: {type?: 'logout'}) => {
  const user: any = await currentUser();
  const role: any = user?.publicMetadata?.role;
  return (
    <div className='flex justify-between px-3 py-2'>
      <form className='gap-2 ring-1 rounded-md ring-gray-400 px-2 py-1 hidden sm:flex'>
        <Image src='/search.png' alt='search.png' width={15} height={15}/>
        <input type="text" placeholder='Search...' className='outline-none' /> 
      </form>
      <div className='flex gap-5 items-center justify-end w-full'>
        <Image src='/message.png' alt='msg-icon' width={20} height={20}/>
        <div className='relative'>
          <Image src='/announcement.png' alt='announcemeng-icon' width={20} height={20}/>
          <div className='w-5 text-sm cursor-pointer absolute -right-3 -top-3 rounded-full bg-red-400 flex items-center justify-center'>1</div>
        </div>
        <div className='flex gap-1 items-center'>
          <div className='flex flex-col text-center'>
            <span className='text-sm text-gray-500'>{user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1).toLowerCase() || ''}</span>
            {/* <span className='text-sm text-gray-500'>{'Sundeep'}</span> */}
            <span className='text-xs text-gray-400'>{role?.charAt(0).toUpperCase() + role?.slice(1).toLowerCase() || 'admin'}</span>
            {/* <span className='text-xs text-gray-400'>{'admin'}</span> */}
          </div>
          {/* <Image src='/avatar.png' alt='admin.png' width={20} height={20} className='rounded-full'/> */}
          <SignOutAndProfile/>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
