import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import { Assignment, Class, Prisma, Student, Subject, Teacher } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/setting'
import getRole, { getUserId } from '@/lib/utils'
import FormContainer from '@/app/components/FormContainer'
// Assignment model or type 
type assignmentList = Assignment & {
    lesson: {
        Subject: Subject,
        class: Class,
        teacher: Teacher,
    }
}
// table headers 

const AssignmentsListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined }; }) => {
    const userId = await getUserId();
    const role = await getRole();
    const { page, ...queryParams } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;
    const query: Prisma.AssignmentWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.title = { contains: value };
                        break;
                    case 'assignmentId':
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
    // ROLE CONDITION 
    switch (role) {
        case 'admin':
            break;
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
                            id: userId?.toString()
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
                            parentId: userId?.toString()
                        }
                    }
                }
            }
            break;
        default:
            break;
    }

    const [data, count] = await prisma.$transaction([
        prisma.assignment.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                lesson: {
                    select: {
                        Subject: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                        class: { select: { name: true, students: true } },
                    }
                },
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.assignment.count({ where: query })
    ])

    const columns = [
        {
            headers: 'Topic/Type',
            accessors: 'topic'
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
            headers: 'Due Date',
            accessors: 'dueDate',
            className: 'hidden lg:table-cell'
        },
        ...(role === "admin" || role === 'teacher' ? [{
            headers: 'Action',
            accessors: 'action',
        }]
            : [])
    ]

    const renderRow = (item: assignmentList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 h-10 hover:bg-blue-50' key={item.id}>
            <td className='font-semibold'>{item.title}</td>
            <td className='font-semibold'>{item?.lesson?.Subject?.name || ''}</td>
            <td className='hidden md:table-cell'>{item?.lesson?.class?.name || ''}</td>
            <td className='hidden lg:table-cell'>{item?.lesson?.teacher? item?.lesson?.teacher?.name + " " + item?.lesson?.teacher?.surname : 'Not Assigned'}</td>
            <td className='hidden lg:table-cell'>{new Intl.DateTimeFormat('en-US').format(item.startDate)}</td>
            <td>
                <div className='flex gap-3 items-center'>
                    {(role === 'admin' || role === 'teacher') && (
                        <>
                            <FormContainer table='assignment' type='delete' data={item} id={item.id} />
                            <FormContainer table='assignment' type='update' data={item} id={item.id} />
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
                <h1 className='font-semibold'>All Assignments</h1>
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
                            <FormContainer table='assignment' type='create' />
                        )}
                    </div>
                </div>
            </div>
            {/* main table of Assignments */}
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

export default AssignmentsListPage;