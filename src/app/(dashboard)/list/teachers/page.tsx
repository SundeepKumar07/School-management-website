import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import prisma from '@/lib/prisma'
import { Class, Prisma, Subject, Teacher } from '@/generated/prisma'
import { ITEM_PER_PAGE } from '@/lib/setting'
import getRole from '@/lib/utils'
import FormContainer from '@/app/components/FormContainer'
import Link from 'next/link'

// teacher model or type 
type teacherList = Teacher & { subjects: Subject[], classes: Class[] }

const TeachersListPage = async (props: {
    params: Promise<{ slug?: string }>   // or whatever dynamic route shape
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) => {
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
    const query: Prisma.TeacherWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'classId':
                        query.lessons = {
                            some: { classId: queryParams.classId ? parseInt(queryParams.classId) : undefined }
                        }
                        break;
                    case 'search':
                        query.name = { contains: value }
                        break;
                    case 'teacherId':
                        query.id = value;
                        break;
                    case 'studentId':
                        query.classes = {
                            some: {
                                students: {
                                    some: {
                                        id: value,
                                    }
                                }
                            }
                        };
                        break;
                    default:
                        break;
                }
            }
        }
    }
    const [data, count] = await prisma.$transaction([
        prisma.teacher.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                subjects: true,
                classes: true,
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.teacher.count({ where: query })
    ])
    const columns = [
        {
            headers: 'Info',
            accessors: 'info'
        },
        {
            headers: 'Teacher ID',
            accessors: 'teacherId',
            className: 'hidden md:table-cell'
        },
        {
            headers: 'Subject',
            accessors: 'subject',
            className: 'hidden md:table-cell'
        },
        {
            headers: 'Classes',
            accessors: 'classes',
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

    const renderRow = (item: teacherList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 hover:bg-blue-50 h-10' key={item.id}>
            <td className='flex gap-4 items-center'>
                <Image src={item.img || '/noAvatar.png'} alt='phote' width={40} height={40} className='md:hidden xl:block w-7 h-7 rounded-full' />
                <div>
                    <h1 className='font-semibold'>{item.name + ' ' + item.surname}</h1>
                    <p className='text-xs text-gray-500'>{item.email}</p>
                </div>
            </td>
            <td className='hidden md:table-cell'>{item.id}</td>
            <td className='hidden md:table-cell'>{item.subjects?.map((subject) => subject.name).join(',')}</td>
            <td className='hidden md:table-cell'>{item.classes?.map(c => c.name).join(',')}</td>
            <td className='hidden lg:table-cell'>{item.phone}</td>
            <td className='hidden md:table-cell'>{item.address}</td>
            <td>
                <div className='flex gap-3 items-center'>
                    <Link href={`/list/teachers/${item.id}`}>
                        <button className='cursor-pointer' title='view'>
                            <Image src={'/view.png'} alt='view' width={20} height={20} className='rounded-full'/>
                        </button>
                    </Link>
                    {role === 'admin' && (
                        <>
                            <FormContainer table='teacher' type='delete' data={item} id={parseInt(item.id)} />
                            <FormContainer table='teacher' type='update' data={item} id={parseInt(item.id)} />
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
                <h1 className='font-semibold'>All Teachers</h1>
                <div className='flex flex-col md:flex-row gap-2'>
                    <TableSearch />
                    <div className='flex gap-2 justify-end'>
                        <button className='bg-blue-100 p-1 rounded-full'>
                            <Image src={'/filter.png'} alt='filter' width={18} height={18} />
                        </button>
                        <button className='bg-blue-100 p-1 rounded-full'>
                            <Image src={'/sort.png'} alt='sort' width={18} height={18} />
                        </button>
                        {role === 'admin' && (
                            <FormContainer type='create' table='teacher' />
                        )}
                    </div>
                </div>
            </div>
            {/* main table of Teachers */}
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

export default TeachersListPage;
