import prisma from '@/lib/prisma'
import Image from 'next/image'
export default async function UserCard({type}: {type: "admin" | "teacher" | "parent" | "student"}) {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  }
  
  const data = await modelMap[type].count()
  return (
    <div className='flex flex-col justify-between odd:bg-green-200 even:bg-blue-200 rounded-lg p-2 gap-2'>
        <div className='flex justify-between'>
            <span className='bg-white rounded-lg px-2 text-sm'>20/08/2025</span>
            <Image src='/more.png' alt='more' width={20} height={20}/>
        </div>
        <span className='text-2xl font-bold text-gray-600'>{data}</span>
        <span className='text-sm text-gray-500'>{type}</span>
    </div>
  )
}
