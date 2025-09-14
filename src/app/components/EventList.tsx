import prisma from '@/lib/prisma'
import React from 'react'

const EventList = async ({ dateParams }: { dateParams: { [key: string]: string | undefined } }) => {
    const dateString = dateParams?.date;
    const date = dateString ? new Date(dateString) : new Date();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const data = await prisma.event.findMany({
        where: {
            startDate: {
                gte: startOfDay,
                lte: endOfDay,
            }
        },
    })
    return (
        <div>
            {data.length === 0 && <p className='text-sm text-center'>No Announcement Yet</p>}
            {data?.map((event) => (
                <div key={event.id} className='p-2 justify-between odd:border-green-200 even:border-blue-200 border-t-2'>
                    <div className='flex font-bold justify-between'>
                        <h1 className='text-sm'>{event.title} </h1>
                        <p className='text-gray-400 text-xs'>{event.startDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })} </p>
                    </div>
                    <p>{event.description ? event.description.split(' ').slice(0, 10).join(' ') : ''}...</p>
                </div>
            ))}
        </div>
    )
}

export default EventList
