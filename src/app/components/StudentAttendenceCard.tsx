import prisma from "@/lib/prisma"
import Image from "next/image"

export const StudentAttendenceCard = async ({id}: {id: string}) => {
    const attendence = await prisma.attendence.findMany({
        where: {
            studentId: id,
            date: {
                gte: new Date(new Date().getFullYear(),0,1)
            }
        },
    });
    const totalDays = attendence.length;
    const presentDays = attendence.filter((day)=> day.present).length;
    const percentage = (presentDays/totalDays) * 100;
    return (
        <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
            <Image src={'/singleAttendance.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6' />
            <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>{percentage.toFixed(1)}%</p>
                <p className='text-sm text-gray-500'>Attendence</p>
            </div>
        </div>
    )
}
