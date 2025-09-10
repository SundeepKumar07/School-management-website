import React from 'react'
import EventList from './EventList'
import EventCalendar from './EventCalendar'

const EventCalendarContainer = ({dateParams}: {dateParams: {[key: string]: string | undefined}}) => {
  return (
    <div className='flex flex-col gap-2'>
        <EventCalendar/>
    <div>
      <div className='bg-white rounded-2xl p-2'>
        <span className='font-semibold p-2'>Events</span>
        <EventList dateParams ={dateParams} />
      </div>
    </div>
    </div>
  )
}

export default EventCalendarContainer;
