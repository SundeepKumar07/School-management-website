import Announcements from '@/app/components/Announcements'
import BigCalendarContainer from '@/app/components/BigCalendarContainer'
import prisma from '@/lib/prisma';
import { getUserId } from '@/lib/utils';

export default async function StudentsPage(props: {
  params: Promise<{ slug?: string }>   // or whatever dynamic route shape
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const searchParams = await props.searchParams

  // ✅ Normalize string[] -> string
  const normalized: { [key: string]: string | undefined } = {}
  for (const key in searchParams ?? {}) {
    const value = searchParams[key]
    normalized[key] = Array.isArray(value) ? value[0] : value
  }
  const userId = await getUserId();
  const data = await prisma.parent.findUnique({
    where: {
      id: userId?.toString()
    },
    include: {
      students: {
        select: { name: true, surname: true, classId: true, class: { select: { name: true } } },
      }
    }
  })
  const uniqueClasses = Array.from(
    new Map(data?.students.map(s => [s.classId, s.class?.name])).entries()
  ).map(([id, name]) => ({ id, name }));
  return (
    <div className='flex flex-col md:flex-row gap-4 sm:gap-4 p-2 w-full'>
      <div className={`w-full md:w-2/3 flex flex-col gap-4`}>
        {uniqueClasses?.map((c, index) => (
          <div key={index}>
            <div className='bg-green-200 text-center text-md font-semibold p-2'>For Class {c.name}</div>
            <div>
              <BigCalendarContainer type='classId' id={c.id} />
            </div>
          </div>
        ))}
      </div>
      <div className={`w-full md:w-1/3 p-2 flex flex-col gap-2 md:h-[${uniqueClasses.length * 100}vh] md:overflow-scroll scrollbar-hide`}>
        <Announcements dateParams={normalized} />
      </div>
    </div>
  )
}