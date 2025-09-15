import Announcements from '@/app/components/Announcements'
import BigCalendarContainer from '@/app/components/BigCalendarContainer'
import EventCalendarContainer from '@/app/components/EventCalendarContainer.tsx'
import prisma from '@/lib/prisma'
import { getUserId } from '@/lib/utils'
import React from 'react'

export default async function StudentsPage(props: {
  params: Promise<{ slug?: string }>   // or whatever dynamic route shape
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const searchParams = await props.searchParams

  // ✅ Normalize string[] -> string
  const normalized: { [key: string]: string | undefined } = {}
  for (const key in searchParams ?? {}) {
    const value = searchParams[key]
    normalized[key] = Array.isArray(value) ? value[0] : value
  }
  const userId = await getUserId();
  const data = await prisma.student.findUnique({
    where: {
      id: userId?.toString(),
    },
  })
  return (
    <div className='flex flex-col md:flex-row gap-4 sm:gap-4 p-2 w-full'>
      <div className='gap-4 p-2 w-full md:w-2/3'>
        <BigCalendarContainer type='classId' id={data?.classId} />
      </div>
      <div className='w-full md:w-1/3 p-2 flex flex-col gap-2 h-screen overflow-scroll'>
        <EventCalendarContainer dateParams={normalized} />
        <Announcements dateParams={{}} />
      </div>
    </div>
  )
}