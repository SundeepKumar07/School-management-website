import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import FormModel from '@/app/components/FormModel'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/setting'
import { Class, Exam, Prisma, Result, Student, Subject, Teacher } from '@/generated/prisma'
import getRole, { getUserId } from '@/lib/utils'

// Result model or type 
type resultList = Result & { Student: Student } & { exam: Exam } & {
    exam: {
        lesson: {
            Subject: Subject,
            teacher: Teacher,
            class: Class,
        }
    }
};

const ResultsListPage = async (props: {
    params: Promise<{ slug?: string }>   // or whatever dynamic route shape
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) => {
    const userId = await getUserId();
    const role = await getRole();
    const searchParams = await props.searchParams

    // ✅ Normalize string[] -> string
    const normalized: { [key: string]: string | undefined } = {}
    for (const key in searchParams ?? {}) {
        const value = searchParams[key]
        normalized[key] = Array.isArray(value) ? value[0] : value
    }
    const { page, ...queryParams } = normalized;
    const pageParam = page ? parseInt(page) : 1;
    const query: Prisma.ResultWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.OR = [
                            { exam: { title: { contains: value }, } },
                            { Student: { name: { contains: value }, } },
                        ]
                        break;
                    case 'studentId':
                        query.studentId = value;
                        break;
                    case 'resultId':
                        query.id = parseInt(value);
                        break;
                    case 'teacherId':
                        query.exam = {
                            lesson: {
                                teacherId: value
                            }
                        };
                        break;
                    default:
                        break;
                }
            }
        }
    }
    // ROLE CONDITION 
    switch (role) {
        case 'teacher':
            query.exam = {
                lesson: {
                    teacher: {
                        id: userId?.toString(),
                    }
                }
            }
            break;
        case 'student':
            query.studentId = userId?.toString();
            break;
        case 'parent':
            query.Student = {
                parentId: userId?.toString()
            };
            break;
    }
    const [data, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                Student: { select: { name: true, surname: true } },
                exam: {
                    select: {
                        title: true,
                        startTime: true,
                        lesson: {
                            select: {
                                Subject: { select: { name: true } },
                                teacher: { select: { name: true, surname: true, id: true } },
                                class: { select: { name: true } },
                            }
                        },
                    }
                },
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.result.count({ where: query })
    ])

    const columns = [
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
            headers: 'Student',
            accessors: 'student',
            className: 'hidden lg:table-cell'
        },
        {
            headers: 'Date',
            accessors: 'date',
            className: 'hidden lg:table-cell'
        },
        {
            headers: 'Type',
            accessors: 'type',
            className: 'hidden lg:table-cell'
        },
        {
            headers: 'Score',
            accessors: 'score',
            className: 'hidden lg:table-cell'
        },
        ...(role === "admin" ? [{
            headers: 'Action',
            accessors: 'action',
        }]
            : [])
    ]
    const renderRow = (item: resultList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 h-10 hover:bg-blue-50' key={item.id}>
            <td className='font-semibold'>{item.exam.lesson.Subject.name}</td>
            <td className='hidden md:table-cell'>{item.exam.lesson.class.name}</td>
            <td className='hidden lg:table-cell'>{item.exam.lesson.teacher.name + " " + item.exam.lesson.teacher.surname}</td>
            <td className='hidden lg:table-cell'>{item.Student.name + " " + item.Student.surname}</td>
            <td className='hidden lg:table-cell'>{new Intl.DateTimeFormat('en-US').format(item.exam.startTime)}</td>
            <td className='hidden lg:table-cell'>{item.exam.title}</td>
            <td className='hidden lg:table-cell'>{item.score}</td>
            <td>
                <div className='flex gap-3 items-center'>
                    {role === 'admin' && (
                        <>
                            <FormModel table='result' type='delete' data={item} id={item.id} />
                            <FormModel table='result' type='update' data={item} id={item.id} />
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
                <h1 className='font-semibold'>All Results</h1>
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
                            <FormModel table='result' type='create' />
                        )}
                    </div>
                </div>
            </div>
            {/* main table of Results */}
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

export default ResultsListPage;