import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/setting'
import { Lesson, Parent, Prisma, Student } from '@/generated/prisma'
import getRole from '@/lib/utils'
import FormContainer from '@/app/components/FormContainer'

// Parents model or type 
type parentList = Parent & { students: Student[] } & { lessons: Lesson };
// table headers 

const ParentsListPage = async (props: {
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
    const query: Prisma.ParentWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.name = { contains: value };
                        break;
                    case 'parentId':
                        query.id = value;
                        break;
                    default:
                        break;
                }
            }
        }
    }
    const [data, count] = await prisma.$transaction([
        prisma.parent.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                students: true,
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.parent.count({ where: query })
    ])
    const renderRow = (item: parentList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 hover:bg-blue-50' key={item.id}>
            <td className='flex flex-col gap-1'>
                <h1 className='font-semibold'>{item.name + " " + item.surname}</h1>
                <p className='text-xs text-gray-500'>{item.email}</p>
            </td>
            <td className='hidden md:table-cell'>{item.students.map(student => student.name).join(',')}</td>
            <td className='hidden lg:table-cell'>{item.phone}</td>
            <td className='hidden md:table-cell'>{item.address}</td>
            <td>
                <div className='flex gap-3 items-center'>
                    {role === 'admin' && (
                        <>
                            <FormContainer table='parent' type='delete' data={item} id={parseInt(item.id)} />
                            <FormContainer table='parent' type='update' data={item} id={parseInt(item.id)} />
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
            headers: 'Student Name',
            accessors: 'studentName',
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
        <div className='rounded-md bg-white p-4 mt-2 mx-2 flex flex-col'>
            {/* top */}
            <div className='flex flex-col md:flex-row justify-between'>
                <h1 className='font-semibold'>All Parents</h1>
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
                            <FormContainer table='parent' type='create' />
                        )}
                    </div>
                </div>
            </div>
            {/* main table of Parents */}
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

export default ParentsListPage;