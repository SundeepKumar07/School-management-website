import Announcements from '@/app/components/Announcements'
import Image from 'next/image'
import Link from 'next/link'
import Performance from '@/app/components/Performance'
import BigCalendarContainer from '@/app/components/BigCalendarContainer'
import prisma from '@/lib/prisma'
export default async function SingleTeacherPage(props: {
    params: Promise<{ id?: string }>   // or whatever dynamic route shape
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await props.params;
  
  //=========== fetching teacher =============
  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        }
      }
    }
  })

  if(!teacher){
    return <p className='text-2xl text-gray-500'>Teacher Not Found</p>
  }

  return (
    <div className='flex flex-col md:flex-row p-3'>
      {/* left  */}
      <div className='w-full md:w-2/3 flex flex-col gap-2'>
        {/* top  */}
        <div className='flex justify-between flex-col lg:flex-row gap-2'>
          {/* user info card  */}
          <div className='flex gap-2 w-full lg:w-2/3 bg-[#f4f7ff] rounded-lg'>
            <div className='w-1/3 flex justify-center items-center py-2'>
              <Image src={teacher.img || '/noAvatar.png'} alt='photo' width={144} height={144} className='w-35 h-35 rounded-full' />
            </div>
            <div className='w-2/3 flex flex-col justify-center gap-2 py-2'>
              <h1 className='text-2xl font-semibold'>{teacher.name + " " + teacher.surname}</h1>
              <p className='text-sm text-gray-500'>Address: {teacher.address}</p>
              <div className='flex flex-col gap-2'>
                <div className='flex gap-5'>
                  <div className='flex gap-2'>
                    <Image src={'/blood.png'} alt='photo' width={10} height={10} />
                    <span className='font-semibold text-xs'>{teacher.bloodgroup}</span>
                  </div>
                  <div className='flex gap-2'>
                    <Image src={'/date.png'} alt='photo' width={10} height={10} />
                    <span className='font-semibold text-xs'>{teacher.birthday? Intl.DateTimeFormat('en-US').format(teacher.birthday) : 'not registered'} </span>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Image src={'/mail.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-xs'>{teacher.email || ''}</span>
                </div>
                <div className='flex gap-2'>
                  <Image src={'/phone.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-xs'>{teacher.phone || ''}</span>
                </div>
              </div>
            </div>
          </div>
          {/* small card  */}
          <div className='w-full lg:w-1/3 grid grid-cols-1 sm:grid-cols-2 gap-2'>
            <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
              <Image src={'/singleAttendance.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6'/>
              <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>90%</p>
                <p className='text-sm text-gray-500'>Attendence</p>
              </div>
            </div>
            <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
              <Image src={'/singleBranch.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6'/>
              <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>{teacher._count.subjects}</p>
                <p className='text-sm text-gray-500'>Branch</p>
              </div>
            </div>
            <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
              <Image src={'/singleLesson.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6'/>
              <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>{teacher._count.lessons}</p>
                <p className='text-sm text-gray-500'>Lesson</p>
              </div>
            </div>
            <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
              <Image src={'/singleClass.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6'/>
              <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>{teacher._count.classes}</p>
                <p className='text-sm text-gray-500'>Class</p>
              </div>
            </div>
          </div>
        </div>
        {/* bottom  */}
        <div>
          <BigCalendarContainer type='teacherId' id={teacher.id} />
        </div>
      </div>
      {/* Right  */}
      <div className='w-full md:w-1/3 pl-2'>
        <div className='flex gap-2 flex-col bg-white py-2 px-1'>
          <h1 className='w-full font-semibold pl-1'>Shortcuts</h1>
          <div className='flex gap-2 flex-wrap'>
            <Link href={`/list/classes?teacherId=${teacher.id}`} className='text-sm text-gray-500 px-2 py-1 bg-purple-50 cursor-pointer rounded-md'>Teacher's Classes</Link>
            <Link href={`/list/students?teacherId=${teacher.id}`} className='text-sm text-gray-500 px-2 py-1 bg-blue-50 cursor-pointer rounded-md'>Teacher's Student</Link>
            <Link href={`/list/lessons?teacherId=${teacher.id}`} className='text-sm text-gray-500 px-2 py-1 bg-green-50 cursor-pointer rounded-md'>Teacher's Lessons</Link>
            <Link href={`/list/exams?teacherId=${teacher.id}`} className='text-sm text-gray-500 px-2 py-1 bg-yellow-50 cursor-pointer rounded-md'>Teacher's Exams</Link>
            <Link href={`/list/assignments?teacherId=${teacher.id}`} className='text-sm text-gray-500 px-2 py-1 bg-red-50 cursor-pointer rounded-md'>Teacher's Assignmets</Link>
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
