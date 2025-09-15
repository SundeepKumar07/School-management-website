import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import { ITEM_PER_PAGE } from '@/lib/setting'
import prisma from '@/lib/prisma'
import { Attendence, Class, Lesson, Prisma, Student } from '@/generated/prisma'
import getRole, { getUserId } from '@/lib/utils'
import AttendenceFilterContainer from '@/app/components/AttendenceFilterContainer'
import Link from 'next/link'
// Events model or type 
type attendenceList = Attendence & { lesson: Lesson } & { student: Student } & {
    lesson: {
        class: Class
    }
};

const attendenceListPage = async (props: {
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
    const query: Prisma.AttendenceWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.student = {
                            name: { contains: value },
                        };
                        break;
                    case 'present':
                        query.present = value === 'true';
                        break;
                    case 'lessonId':
                        query.lessonId = parseInt(value);
                        break;
                    case 'classId':
                        query.lesson = {
                            classId: parseInt(value),
                        };
                        break;
                    case 'date':
                        query.date = new Date(value);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    switch (role) {
        case 'admin':
            break;
        case 'teacher':
            query.lesson = {
                teacherId: userId?.toString(),
            }
            break;
        case 'student':
            query.student = {
                id: userId?.toString()
            }
            break;
        case 'parent':
            query.student = {
                parentId: userId?.toString(),
            }
            break;
        default:
            break;
    }

    const [data, count] = await prisma.$transaction([
        prisma.attendence.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                lesson: {
                    select: {
                        id: true,
                        name: true,
                        class: {
                            select: { id: true, name: true }
                        },
                    },
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                    }
                }
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.attendence.count({ where: query })
    ])

    const columns = [
        {
            headers: 'Date',
            accessors: 'date'
        },
        {
            headers: 'Student Name',
            accessors: 'studentName',
        },
        {
            headers: 'Present',
            accessors: 'present',
        },
        {
            headers: 'Class Name',
            accessors: 'className',
            className: 'hidden sm:table-cell'
        },
        {
            headers: 'Lesson Name',
            accessors: 'lessonName',
            className: 'hidden lg:table-cell'
        },
        // ...((role === 'admin' || role === 'teacher') ? [{
        //     headers: 'Action',
        //     accessors: 'action',
        // }]
        //     : [])
    ]

    const renderRow = (item: attendenceList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 h-10 hover:bg-blue-50' key={item.id}>
            <td className='font-semibold'>{Intl.DateTimeFormat('en-us').format(item.date)}</td>
            <td className=''>{item.student?.name ? (item.student?.name + " " + item.student?.surname) : "Missing"}</td>
            <td className=''>{item.present ? '✔' : '✖'}</td>
            <td className='hidden sm:table-cell'>{item.lesson.class.name}</td>
            <td className='hidden lg:table-cell'>{item.lesson?.name || 'not defined'}</td>
            {/* ,{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            } */}
            <td>
                <div className='flex gap-3 items-center'>
                    {(role === 'admin' || role === 'teacher') && (
                        <>
                            {/* <FormContainer table='attendence' type='delete' data={item} id={item.id} /> */}
                            {/* <Link href={''}>
                                <button className={`bg-green-100`}>
                                    <Image src={`/update.png`} alt={`update png`} width={18} height={18} className="rounded-full cursor-pointer" />
                                </button>
                            </Link> */}
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
    return (
        <div className='rounded-md bg-white p-4 mt-2 md:mx-2 flex flex-col'>
            {/* top */}
            <div className='flex flex-col md:flex-row justify-between'>
                <h1 className='font-semibold'>All Attendences</h1>
                <div className='flex flex-col md:flex-row gap-2'>
                    <TableSearch />
                    <div className='flex gap-2 justify-end'>
                        <button className='bg-blue-100 p-1 rounded-full'>
                            <Image src={'/filter.png'} alt='filter' width={18} height={18} />
                        </button>
                        <button className='bg-blue-100 p-1 rounded-full'>
                            <Image src={'/sort.png'} alt='filter' width={18} height={18} />
                        </button>
                    </div>
                </div>
            </div>
            {(role === 'admin' || role === 'teacher') &&
                <div className='flex flex-col-reverse md:items-center justify-between md:flex-row'>
                    <AttendenceFilterContainer type={'read'} />
                    <Link href={'/list/mark-attendence'} className='flex items-center bg-green-200 mt-2 md:mt-4 py-1 px-2 rounded-md w-full md:w-45'>
                        Go to Attendence
                    </Link>
                </div>
            }
            {/* main table of Events */}
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

export default attendenceListPage;