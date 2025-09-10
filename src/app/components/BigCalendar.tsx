'use client';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

const localizer = momentLocalizer(moment);

const BigCalendar = ({data}: {data: {title: string, start: Date, end: Date}[]}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  return (
    <div className='flex flex-col gap-4 bg-white'>
    <h1 className='text-xl mt-2 font-semibold'>Schedule</h1>
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 510 }}
      views={[Views.WORK_WEEK, Views.DAY]}
      view={view}
      onView={(newView: View) => setView(newView)}
      min={new Date(2025, 7, 12, 6, 0)}   // 8:00 AM
      max={new Date(2025, 7, 12, 18, 0)}
    />
    </div>
  );
};

export default BigCalendar;