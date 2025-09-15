import prisma from '@/lib/prisma';
import React from 'react'

type AnnouncementProps = {
  dateParams?: { [key: string]: string | undefined };
};

export default async function Announcements({dateParams}: AnnouncementProps) {
  const dateString = dateParams?.date;
  const date = dateString ? new Date(dateString) : new Date();

  const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const data = await prisma.announcement.findMany({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay,
            }
        },
    })
  return (
    <div className='p-2 bg-white rounded-lg'>
      <span className='font-semibold py-2 px-2'>Announcements</span>
      <div className='flex flex-col gap-2'>
        {data.length === 0 && <p className='text-sm text-center'>No Announcement Yet</p>}
        {data?.map((item)=>(
          <div key={item.id} className='flex flex-col justify-between p-2 odd:bg-green-200 even:bg-blue-200 shadow-sm'>
            <div className='font-bold flex justify-between text-sm'>
              <span className='text-sm'>{item.title}</span>
              <span className='bg-white text-xs px-1 rounded text-gray-400'>{new Intl.DateTimeFormat('en-US').format(item.date)}</span>
            </div>
            <span>{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
