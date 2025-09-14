import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import { Class, Grade, Lesson, Prisma, Student, Teacher } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/setting'
import getRole, { getUserId } from '@/lib/utils'
import FormContainer from '@/app/components/FormContainer'
// Classes model or type 
type classList = Class & { students: Student[] } & { grade: Grade, supervisor: Teacher } & { lessons: Lesson[] }

const ClassesListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined }; }) => {
    const userId = await getUserId();
    const role = await getRole();
    const { page, ...queryParams } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;
    const query: Prisma.ClassWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.name = { contains: value };
                        break;
                    case 'classId':
                        query.id = parseInt(value);
                        break;
                    case 'teacherId':
                        query.supervisorId = value;
                        break;
                    default:
                        break;
                }
            }
        }
    }
    switch(role){
        case 'teacher':
            query.lessons = {
                some: {
                    teacherId: userId?.toString(),
                }
            }
            break;
        default:
            break;
    }
    const [data, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                students: true,
                grade: true,
                supervisor: true,
                lessons: true,
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.class.count({ where: query })
    ])

    const columns = [
        {
            headers: 'Name',
            accessors: 'name'
        },
        {
            headers: 'Capacity',
            accessors: 'capacity',
            className: 'hidden lg:table-cell'
        },
        {
            headers: 'Grade',
            accessors: 'grade',
            className: 'hidden md:table-cell'
        },
        {
            headers: 'Supervisor',
            accessors: 'supervisor',
            className: 'hidden md:table-cell'
        },
        ...(role === "admin" ? [{
            headers: 'Action',
            accessors: 'action',
        }]
            : [])
    ]

    const renderRow = (item: classList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 h-10 hover:bg-blue-50' key={item.id}>
            <td className='font-semibold'>{item.name}</td>
            <td className='hidden md:table-cell'>{item?.students.length}</td>
            <td className='hidden md:table-cell'>{item?.grade.level}</td>
            <td className='hidden lg:table-cell'>{item?.supervisor?.name + " " + item?.supervisor?.surname || ''}</td>
            <td>
                <div className='flex gap-3 items-center'>
                    {role === 'admin' && (
                        <>
                            <FormContainer table='class' type='delete' data={item} id={item.id} />
                            <FormContainer table='class' type='update' data={item} id={item.id} />
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
                <h1 className='font-semibold'>All Classes</h1>
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
                            <FormContainer table='class' type='create' />
                        )}
                    </div>
                </div>
            </div>
            {/* main table of Classes */}
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

export default ClassesListPage;