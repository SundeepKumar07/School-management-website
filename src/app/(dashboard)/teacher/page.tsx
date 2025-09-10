import Announcements from '@/app/components/Announcements'
import BigCalendarContainer from '@/app/components/BigCalendarContainer'
import { getUserId } from '@/lib/utils';

export default async function TeachersPage() {
  const userId = await getUserId();
  return (
    <div className='flex flex-col md:flex-row gap-4 sm:gap-4 p-2 w-full'>
        <BigCalendarContainer type='teacherId' id={userId?.toString()}/>
        <div className='w-full md:w-1/3 p-2 flex flex-col gap-2 h-screen overflow-scroll'>
          <Announcements dateParams={{}}/>
        </div>
    </div>
  )
}