import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import { Class, Lesson, Prisma, Subject, Teacher } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/setting'
import getRole, { getUserId } from '@/lib/utils'
import FormContainer from '@/app/components/FormContainer'
// Lessons model or type 
type lessonList = Lesson & { teacher: Teacher } & { class: Class } & { Subject: Subject };

const LessonsListPage = async (props: {
    params: Promise<{ slug?: string }>   // or whatever dynamic route shape
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) => {
    const role = await getRole();
    const userId = await getUserId();
    const searchParams = await props.searchParams

    // ✅ Normalize string[] -> string
    const normalized: { [key: string]: string | undefined } = {}
    for (const key in searchParams ?? {}) {
        const value = searchParams[key]
        normalized[key] = Array.isArray(value) ? value[0] : value
    }
    const { page, ...queryParams } = normalized;
    const pageParam = page ? parseInt(page) : 1;
    const query: Prisma.LessonWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.name = { contains: value };
                        break;
                    case 'lessonId':
                        query.id = parseInt(value);
                        break;
                    case 'teacherId':
                        query.teacherId = value;
                        break;
                    case 'studentId':
                        query.class = {
                            students: {
                                some: {
                                    id: value,
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    switch (role) {
        case 'teacher':
            query.teacherId = userId?.toString();
            break;
        default:
            break;
    }
    const [data, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                Subject: true,
                class: true,
                teacher: true,
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.lesson.count({ where: query })
    ])

    const columns = [
        {
            headers: 'Lesson Name',
            accessors: 'lesson'
        },
        {
            headers: 'Subject',
            accessors: 'subject'
        },
        {
            headers: 'Class',
            accessors: 'class',
            className: 'hidden md:table-cell'
        },
        {
            headers: 'Teacher',
            accessors: 'teacher',
            className: 'hidden lg:table-cell'
        },
        ...(role === "admin" ? [{
            headers: 'Action',
            accessors: 'action',
        }]
            : [])
    ]

    const renderRow = (item: lessonList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 h-10 hover:bg-blue-50' key={item.id}>
            <td className='font-semibold'>{item.name}</td>
            <td className='font-semibold'>{item?.Subject?.name}</td>
            <td className='hidden md:table-cell'>{item?.class?.name}</td>
            <td className='hidden lg:table-cell'>{item?.teacher ? item?.teacher?.name + " " + item?.teacher?.surname : 'Not Assigned'}</td>
            <td>
                <div className='flex gap-3 items-center'>
                    {role === 'admin' && (
                        <>
                            <FormContainer table='lesson' type='delete' data={item} id={item.id} />
                            <FormContainer table='lesson' type='update' data={item} id={item.id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
    return (
        <div className='rounded-md bg-white p-4 mt-2 mx-2 flex flex-col'>
            {/* top */}
            <div className='flex flex-col md:flex-row justify-between'>
                <h1 className='font-semibold'>All Lessons</h1>
                <div className='flex flex-col md:flex-row gap-2'>
                    <TableSearch />
                    <div className='flex gap-2 justify-end'>
                        <button className='bg-blue-100 p-1 rounded-full'>
                            <Image src={'/filter.png'} alt='filter' width={18} height={18} />
                        </button>
                        <button className='bg-blue-100 p-1 rounded-full'>
                            <Image src={'/sort.png'} alt='filter' width={18} height={18} />
                        </button>
                        {role === 'admin' && (
                            <FormContainer table='lesson' type='create' />
                        )}
                    </div>
                </div>
            </div>
            {/* main table of Lessons */}
            <div>
                <Table columns={columns} renderRow={renderRow} data={data} />
            </div>
            {/* pagination  */}
            <div className='mt-4'>
                <Pagination page={pageParam} totalPage={count} />
            </div>
        </div>
    )
}

export default LessonsListPage;