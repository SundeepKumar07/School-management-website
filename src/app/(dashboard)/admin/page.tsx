import Announcements from '@/app/components/Announcements'
import AttendenceContainer from '@/app/components/AttendenceContainer'
import EventCalendarContainer from '@/app/components/EventCalendarContainer.tsx'
import FinanceChart from '@/app/components/FinanceChart'
import StudentCountContainer from '@/app/components/StudentCountContainer'
import UserCard from '@/app/components/UserCard'
import React from 'react'

export default async function ({searchParams}: {searchParams: {[key: string]: string | undefined}}) {
  return (
    <div className='flex flex-col md:flex-row gap-4 sm:gap-4 p-2 overflow-hidden'>
        <div className='w-full md:w-2/3 flex flex-col gap-4'>
          <div className='grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2'>
            <UserCard type='admin'/>
            <UserCard type='teacher'/>
            <UserCard type='student'/>
            <UserCard type='parent'/>
          </div>
          <div className='flex gap-4 sm:gap-4 flex-col sm:flex-row'>
            <div className='w-full md:w-1/3 h-70'>
              <StudentCountContainer/>
            </div>
            <div className='w-full md:w-2/3 h-70'>
              <AttendenceContainer/>
            </div>
          </div>
          <div className='h-100 bg-white'>
            <FinanceChart/>
          </div>
        </div>
        <div className='w-full md:w-1/3 md:h-230 lg:h-200 overflow-scroll flex flex-col gap-2 pr-2'>
          <EventCalendarContainer dateParams={await searchParams}/>
          <Announcements dateParams={await searchParams}/>
        </div>
    </div>
  )
}
