import prisma from '@/lib/prisma'
import React from 'react'
import BigCalendar from './BigCalendar'
import { adjustScheduleToCurrentWeek } from '@/lib/utils'

const BigCalendarContainer = async ({ type, id }: { type: "teacherId" | "classId", id: string | number | undefined }) => {
    const dataRes = await prisma.lesson.findMany({
        where: {
            ...(type === 'teacherId' ? { teacherId: id as string } : { classId: id as number })
        }
    })
    const data = dataRes.map((lesson => ({
        title: lesson.name,
        start: lesson.startTime,
        end: lesson.endTime,
    })))

    const schedule = adjustScheduleToCurrentWeek(data);
    return (
        <div className='w-full flex flex-col gap-4'>
            <BigCalendar data={schedule} />
        </div>
    )
}

export default BigCalendarContainer
