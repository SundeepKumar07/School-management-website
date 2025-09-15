import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/setting'
import { Class, Grade, Prisma, Student } from '@/generated/prisma'
import getRole, { getUserId } from '@/lib/utils'
import FormContainer from '@/app/components/FormContainer'
import Link from 'next/link'

type studentList = Student & { class: Class } & { grade: Grade };

const StudentsListPage = async (props: {
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
    const { page, ...queryParams } = await normalized;
    const pageParam = page ? parseInt(page) : 1;
    const query: Prisma.StudentWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'teacherId':
                        query.class = {
                            lessons: {
                                some: { teacherId: value }
                            }
                        }
                        break;
                    case 'search':
                        query.name = { contains: value }
                        break;
                    case 'studentId':
                        query.id = value;
                        break;
                    default:
                        break;
                }
            }
        }
    }
    // ROLL CONDITION 
    switch (role) {
        case 'teacher':
            query.class = {
                lessons: {
                    some: {
                        teacherId: userId?.toString(),
                    }
                }
            }
            break;
        default:
            break;
    }

    const [data, count] = await prisma.$transaction([
        prisma.student.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                grade: true,
                class: true,
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.student.count({ where: query })
    ])
    const renderRow = (item: studentList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 hover:bg-blue-50' key={item.id}>
            <td className='flex gap-4 items-center h-10'>
                <Image src={item.img || '/noAvatar.png'} alt='phote' width={40} height={40} className='md:hidden xl:block w-8 h-8 rounded-full' />
                <div>
                    <h1 className='font-semibold'>{item.name}</h1>
                    <p className='text-xs text-gray-500'>{item.email}</p>
                </div>
            </td>
            <td className='hidden md:table-cell'>{item.id}</td>
            <td className='hidden md:table-cell'>{item.grade.level}</td>
            <td className='hidden md:table-cell'>{item.class?.name}</td>
            <td className='hidden lg:table-cell'>{item.phone}</td>
            <td className='hidden md:table-cell'>{item.address}</td>
            <td>
                <div className='flex gap-3 items-center'>
                    <Link href={`/list/students/${item.id}`}>
                        <button className='cursor-pointer' title='view'>
                            <Image src={'/view.png'} alt='view' width={20} height={20} className='rounded-full' />
                        </button>
                    </Link>
                    {role === 'admin' && (
                        <>
                            <FormContainer table='student' type='delete' data={item} id={parseInt(item.id)} />
                            <FormContainer table='student' type='update' data={item} id={parseInt(item.id)} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    )

    const columns = [
        {
            headers: 'Info',
            accessors: 'info'
        },
        {
            headers: 'Student ID',
            accessors: 'student',
            className: 'hidden md:table-cell'
        },
        {
            headers: 'Grade',
            accessors: 'grade',
            className: 'hidden md:table-cell'
        },
        {
            headers: 'Class',
            accessors: 'class',
            className: 'hidden md:table-cell'
        },
        {
            headers: 'Phone',
            accessors: 'phone',
            className: 'hidden lg:table-cell'
        },
        {
            headers: 'Address',
            accessors: 'address',
            className: 'hidden md:table-cell'
        },
        ...(role === "admin" ? [{
            headers: 'Action',
            accessors: 'action',
        }]
            : [])
    ]
    return (
        <div className='rounded-md bg-white p-4 mt-2 md:mx-2 flex flex-col'>
            {/* top */}
            <div className='flex flex-col md:flex-row justify-between'>
                <h1 className='font-semibold'>All Students</h1>
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
                            <FormContainer table='student' type='create' />
                        )}
                    </div>
                </div>
            </div>
            {/* main table of Students */}
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

export default StudentsListPage;