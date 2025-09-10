import React from 'react'
import { motion } from "framer-motion";
import AttendenceChart from './AttendenceChart';
import prisma from '@/lib/prisma';
const AttendenceContainer = async () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const lastMonday = new Date(today);
    const daySinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    lastMonday.setDate(today.getDate() - daySinceMonday);
    lastMonday.setHours(0, 0, 0, 0);

    const resData = await prisma.attendence.findMany({
        where: {
            date: {
                gte: lastMonday,
            },
        },
        select: {
            date: true,
            present: true,
        }
    })
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    const attendemceMap: { [key: string]: { present: number, absent: number } } = {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thu: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
    }
    resData.forEach((item) => {
        const itemDate = new Date(item.date);
        const itemDayOfWeek = itemDate.getDay(); // 0 = Sun, 1 = Mon, ...

        if (itemDayOfWeek >= 1 && itemDayOfWeek <= 5) {
            const dayName = daysOfWeek[itemDayOfWeek - 1]; // map Mon-Fri correctly
            if (item.present) {
                attendemceMap[dayName].present += 1;
            } else {
                attendemceMap[dayName].absent += 1;
            }
        }
    });
    const data = daysOfWeek.map((day) => ({
        name: day,
        present: attendemceMap[day].present,
        absent: attendemceMap[day].absent,
    }))
    return (
        <div className='bg-white h-full w-full rounded-2xl flex flex-col items-center'>
            {/* <motion.span
                    className="mb-2 font-semibold"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    >
                    Attendence
                    </motion.span> */}
            <div>Attendence</div>
            <AttendenceChart data={data} />
        </div>
    )
}

export default AttendenceContainer
