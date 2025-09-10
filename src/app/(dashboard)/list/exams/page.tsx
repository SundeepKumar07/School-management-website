import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import FormModel from '@/app/components/FormModel'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/setting'
import { Class, Exam, Prisma, Subject, Teacher } from '@/generated/prisma'
import getRole, { getUserId } from '@/lib/utils'
// Exam model or type 
type examList = Exam & {
    lesson: {
        class: Class,
        teacher: Teacher,
        Subject: Subject,
    }
}
// table headers 

const ExamsListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined }; }) => {
    const userId = await getUserId();
    const role = await getRole();
    const { page, ...queryParams } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;
    const query: Prisma.ExamWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.title = { contains: value };
                        break;
                    case 'lessonId':
                        query.id = parseInt(value);
                        break;
                    case 'teacherId':
                        query.lesson = {
                            teacherId: value,
                        }
                        break;
                    case 'studentId':
                        query.lesson = {
                            class: {
                                students: {
                                    some: {
                                        id: value,
                                    }
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
    // role condition 
    switch(role){
        case 'teacher':
            query.lesson = {
                teacherId: userId?.toString(),
            }
            break;
        case 'student':
            query.lesson = {
                class: {
                    students: {
                        some: {
                            id: userId?.toString(),
                        }
                    }
                }
            }
            break;
        case 'parent':
            query.lesson = {
                class: {
                    students: {
                        some: {
                            parentId: userId?.toString(),
                        }
                    }
                }
            }
            break;
    }
    const [data, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                lesson: {
                    select: {
                        Subject: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                        class: { select: { name: true } },
                    }
                },
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.exam.count({ where: query })
    ])

    const columns = [
        {
            headers: 'Exam Title',
            accessors: 'title'
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
        {
            headers: 'Date',
            accessors: 'date',
            className: 'hidden lg:table-cell'
        },
        ...((role === "admin" || role === 'teacher') ? [{
            headers: 'Action',
            accessors: 'action',
        }]
            : [])
    ]
    const renderRow = (item: examList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 h-10 hover:bg-blue-50' key={item.id}>
            <td className='font-semibold'>{item.title}</td>
            <td className='font-semibold'>{item.lesson.Subject.name}</td>
            <td className='hidden md:table-cell'>{item.lesson.class.name}</td>
            <td className='hidden lg:table-cell'>{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
            <td className='hidden lg:table-cell'>{new Intl.DateTimeFormat('en-US').format(item.startTime)}</td>
            <td>
                <div className='flex gap-3 items-center'>
                    {(role === 'admin' || role === 'teacher') && (
                        <>
                            <FormModel table='exam' type='delete' data={item} id={item.id} />
                            <FormModel table='exam' type='update' data={item} id={item.id} />
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
                <h1 className='font-semibold'>All Exams</h1>
                <div className='flex flex-col md:flex-row gap-2'>
                    <TableSearch />
                    <div className='flex gap-2 justify-end'>
                        <button className='bg-blue-100 p-1 rounded-full'>
                            <Image src={'/filter.png'} alt='filter' width={18} height={18} />
                        </button>
                        <button className='bg-blue-100 p-1 rounded-full'>
                            <Image src={'/sort.png'} alt='filter' width={18} height={18} />
                        </button>
                        {(role === 'admin' || role === 'teacher') && (
                            <FormModel table='exam' type='create' />
                        )}
                    </div>
                </div>
            </div>
            {/* main table of Exams */}
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

export default ExamsListPage;