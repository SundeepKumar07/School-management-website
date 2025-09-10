import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import FormModel from '@/app/components/FormModel'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/setting'
import { Lesson, Prisma, Subject, Teacher } from '@/generated/prisma'
import getRole from '@/lib/utils'
import FormContainer from '@/app/components/FormContainer'

// Subject model or type 
type subjectList = Subject & { teachers: Teacher[] } & { lessons: Lesson[] }

const SubjectListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined }; }) => {
    const role = await getRole();
    const { page, ...queryParams } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;
    const query: Prisma.SubjectWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.name = { contains: value };
                        break;
                    case 'subjectId':
                        query.id = parseInt(value);
                        break;
                    case 'teacherId':
                        query.teachers = {
                            some: {
                                id: value,
                            }
                        }
                    case 'studentId':
                        query.lessons = {
                            some: {
                                class: {
                                    students: {
                                        some: {
                                            id: value,
                                        }
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
    const [data, count] = await prisma.$transaction([
        prisma.subject.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                teachers: true,
                lessons: true,
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.subject.count({ where: query })
    ])

    const columns = [
        {
            headers: 'Info',
            accessors: 'info'
        },
        {
            headers: 'Teachers Name',
            accessors: 'teachersName',
            className: 'hidden md:table-cell'
        },
        ...(role === "admin" ? [{
            headers: 'Action',
            accessors: 'action',
        }]
            : [])
    ]
    const renderRow = (item: subjectList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 px-2 h-10 items-center hover:bg-blue-50' key={item.id}>
            <td className='font-semibold'>{item.name}</td>
            <td className='hidden md:table-cell'>{item.teachers.map(teacher => teacher.name).join(', ')}</td>
            <td>
                <div className='flex gap-3 items-center'>
                    {role === 'admin' && (
                        <>
                            <FormContainer table='subject' type='delete' data={item} id={item.id} />
                            <FormContainer table='subject' type='update' data={item} id={item.id} />
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
                <h1 className='font-semibold'>All Subjects</h1>
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
                            <FormContainer table='subject' type='create' />
                        )}
                    </div>
                </div>
            </div>
            {/* main table of Subjects */}
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
export default SubjectListPage;