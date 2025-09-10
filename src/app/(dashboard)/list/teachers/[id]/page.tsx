import Announcements from '@/app/components/Announcements'
import BigCalendar from '@/app/components/BigCalendar'
import Image from 'next/image'
import Link from 'next/link'
import Performance from '@/app/components/Performance'
export default function SingleTeacherPage() {
  return (
    <div className='flex flex-col md:flex-row p-3'>
      {/* left  */}
      <div className='w-full md:w-2/3 flex flex-col gap-2'>
        {/* top  */}
        <div className='flex justify-between flex-col lg:flex-row gap-2'>
          {/* user info card  */}
          <div className='flex gap-4 w-full lg:w-2/3 bg-[#f4f7ff] rounded-lg'>
            <div className='w-1/3 flex justify-center items-center py-2'>
              <Image src={'https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200'} alt='photo' width={144} height={144} className='w-35 h-35 rounded-full' />
            </div>
            <div className='w-2/3 flex flex-col justify-center gap-2 py-2'>
              <h1 className='text-2xl font-semibold'>John Wick</h1>
              <p className='text-sm text-gray-500'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos, alias!</p>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                <div className='flex gap-2 pb-2'>
                  <Image src={'/blood.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-sm'>A+</span>
                </div>
                <div className='flex gap-2 pb-2'>
                  <Image src={'/date.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-sm'>January 26</span>
                </div>
                <div className='flex gap-2'>
                  <Image src={'/mail.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-sm'>john@gmail.com</span>
                </div>
                <div className='flex gap-2'>
                  <Image src={'/phone.png'} alt='photo' width={10} height={10} />
                  <span className='font-semibold text-sm'>+92 300 5534214</span>
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
                <p className='text-xl text-gray-800 font-semibold'>2</p>
                <p className='text-sm text-gray-500'>Branch</p>
              </div>
            </div>
            <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
              <Image src={'/singleLesson.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6'/>
              <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>6</p>
                <p className='text-sm text-gray-500'>Lesson</p>
              </div>
            </div>
            <div className='flex gap-2 bg-white py-2 items-center rounded-md'>
              <Image src={'/singleClass.png'} alt='attendence.png' width={20} height={20} className='w-6 h-6'/>
              <div className=''>
                <p className='text-xl text-gray-800 font-semibold'>6</p>
                <p className='text-sm text-gray-500'>Class</p>
              </div>
            </div>
          </div>
        </div>
        {/* bottom  */}
        <div>
          <BigCalendar />
        </div>
      </div>
      {/* Right  */}
      <div className='w-full md:w-1/3 pl-2'>
        <div className='flex gap-2 flex-col bg-white py-2 px-1'>
          <h1 className='w-full font-semibold pl-1'>Shortcuts</h1>
          <div className='flex gap-2 flex-wrap'>
            <Link href={'/list/classes'} className='text-sm text-gray-500 px-2 py-1 bg-purple-50 cursor-pointer rounded-md'>Teacher's Classes</Link>
            <Link href={'/list/students'} className='text-sm text-gray-500 px-2 py-1 bg-blue-50 cursor-pointer rounded-md'>Teacher's Student</Link>
            <Link href={'/list/lessons'} className='text-sm text-gray-500 px-2 py-1 bg-green-50 cursor-pointer rounded-md'>Teacher's Lessons</Link>
            <Link href={'/list/exams'} className='text-sm text-gray-500 px-2 py-1 bg-yellow-50 cursor-pointer rounded-md'>Teacher's Exams</Link>
            <Link href={'/list/assignments'} className='text-sm text-gray-500 px-2 py-1 bg-red-50 cursor-pointer rounded-md'>Teacher's Assignmets</Link>
          </div>
        </div>
        <div className='h-60 bg-white my-2'>
          <Performance/>
        </div>
        <div className='w-full'>
          <Announcements/>
        </div>
      </div>
    </div>
  )
}
