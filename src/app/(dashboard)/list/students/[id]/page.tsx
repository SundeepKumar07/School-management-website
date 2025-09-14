import Announcements from '@/app/components/Announcements'
import Image from 'next/image'
import Link from 'next/link'
import Performance from '@/app/components/Performance'
import BigCalendarContainer from '@/app/components/BigCalendarContainer'
import prisma from '@/lib/prisma'
import { Suspense } from 'react'
import { StudentAttendenceCard } from '@/app/components/StudentAttendenceCard'
export default async function SingleTeacherPage({params}: {params: {id: string}}) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
     grade: {select: {level: true}},
     class: {select: {name: true,
      _count: {
        select: {
          lessons: true,
        }
      }
     }},
    }
  })

  if(!student){
    return <p className='text-2xl text-gray-500'>Student Not Found</p>
  }
  return (
    <div className='flex flex-col md:flex-row p-3'>
      {/* left  */}
      <div className='w-full md:w-2/3 flex flex-col gap-2'>
        {/* top  */}
        <div className='flex justify-between flex-col lg:flex-row gap-2'>
          {/* user info card  */}
          <div className='flex gap-4 w-full lg:w-2/3 bg-[#f4f7ff] rounded-lg'>
            <div className='w-1/3 flex justify-center items-center py-2'>
              <Image src={student.img || '/noAvatar.png'} alt='photo' width={144} height={144} className='w-35 h-35 rounded-full' />
            </div>
            <div className='w-2/3 flex flex-col justify-center gap-2 py-2'>
              <h1 className='text-2xl font-semibold'>{student.name + " " + student.surname}</h1>
              <p className='text-sm text-gray-500'>Address: {student.address}</p>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                <div className='flex gap-2 pb-2'>
                  <Image src={'/blood.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-sm'>{student.bloodgroup}</span>
                </div>
                <div className='flex gap-2 pb-2'>
                  <Image src={'/date.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-sm'>{student.birthday? Intl.DateTimeFormat('en-US').format(student.birthday) : "Not defined"}</span>
                </div>
                <div className='flex gap-2'>
                  <Image src={'/mail.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-sm'>{student.email || "Not Defined"}</span>
                </div>
                <div className='flex gap-2'>
                  <Image src={'/phone.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-sm'>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* small card  */}
          <div className='w-full lg:w-1/3 grid grid-cols-1 sm:grid-cols-2 gap-2'>
            <Suspense fallback={'loading...'}>
              <StudentAttendenceCard id={student.id}/>
            </Suspense>
            <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
              <Image src={'/singleBranch.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6'/>
              <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>{student.grade.level}</p>
                <p className='text-sm text-gray-500'>Grade</p>
              </div>
            </div>
            <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
              <Image src={'/singleLesson.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6'/>
              <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>{student.class._count.lessons}</p>
                <p className='text-sm text-gray-500'>Lesson</p>
              </div>
            </div>
            <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
              <Image src={'/singleClass.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6'/>
              <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>{student.class.name}</p>
                <p className='text-sm text-gray-500'>Class</p>
              </div>
            </div>
          </div>
        </div>
        {/* bottom  */}
        <div>
          <BigCalendarContainer type='classId' id={student.classId} />
        </div>
      </div>
      {/* Right  */}
      <div className='w-full md:w-1/3 pl-2'>
        <div className='flex gap-2 flex-col bg-white py-2 px-1'>
          <h1 className='w-full font-semibold pl-1'>Shortcuts</h1>
          <div className='flex gap-2 flex-wrap'>
            <Link href={`/list/teachers?studentId=${student.id}`} className='text-sm text-gray-500 px-2 py-1 bg-blue-50 cursor-pointer rounded-md'>Student's Teachers</Link>
            <Link href={`/list/lessons?studentId=${student.id}`} className='text-sm text-gray-500 px-2 py-1 bg-purple-50 cursor-pointer rounded-md'>Student's Lessons</Link>
            <Link href={`/list/assignments?studentId=${student.id}`} className='text-sm text-gray-500 px-2 py-1 bg-red-50 cursor-pointer rounded-md'>Student's Assignmets</Link>
            <Link href={`/list/exams?studentId=${student.id}`} className='text-sm text-gray-500 px-2 py-1 bg-yellow-50 cursor-pointer rounded-md'>Student's Exams</Link>
            <Link href={`/list/results?studentId=${student.id}`} className='text-sm text-gray-500 px-2 py-1 bg-green-50 cursor-pointer rounded-md'>Student's Results</Link>
          </div>
        </div>
        <div className='h-60 bg-white my-2'>
          <Performance/>
        </div>
        <div className='w-full'>
          <Announcements dateParams={{}}/>
        </div>
      </div>
    </div>
  )
}