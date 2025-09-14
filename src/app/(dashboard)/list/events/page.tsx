import TableSearch from '@/app/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/app/components/Pagination'
import Table from '@/app/components/Table'
import { ITEM_PER_PAGE } from '@/lib/setting'
import prisma from '@/lib/prisma'
import { Class, Event, Prisma } from '@/generated/prisma'
import getRole, { getUserId } from '@/lib/utils'
import FormContainer from '@/app/components/FormContainer'
// Events model or type 
type eventList = Event & { class: Class };

const EventsListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined }; }) => {
    const role = await getRole();
    const userId = await getUserId();
    const { page, ...queryParams } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;
    const query: Prisma.EventWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.title = { contains: value };
                        break;
                    case 'eventId':
                        query.id = parseInt(value);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    // const roleConditions = {
    //     admin: {},
    //     teacher: {lessons: {some: {teacherId: userId?.toString()}}},
    //     student: {students: {some: {id: userId?.toString()}}},
    //     parent: {students: {some: {parentId: userId?.toString()}}},
    // }
    // query.OR = [
    //     {
    //         class: roleConditions[role as keyof typeof roleConditions] || {}
    //     },
    //     {classId: null},
    // ]

    const [data, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                class: true,
            },
            skip: ITEM_PER_PAGE * (pageParam - 1)
        }),

        prisma.event.count({ where: query })
    ])

    const columns = [
        {
            headers: 'Title',
            accessors: 'title'
        },
        {
            headers: 'Class',
            accessors: 'class',
            className: 'hidden md:table-cell'
        },
        {
            headers: 'Date',
            accessors: 'date',
            className: 'hidden lg:table-cell'
        },
        {
            headers: 'Start Time',
            accessors: 'startTime',
            className: 'hidden lg:table-cell'
        },
        {
            headers: 'End Time',
            accessors: 'endTime',
            className: 'hidden lg:table-cell'
        },
        ...(role === "admin" ? [{
            headers: 'Action',
            accessors: 'action',
        }]
            : [])
    ]

    const renderRow = (item: eventList) => (
        <tr className='text-sm odd:bg-white even:bg-gray-200 p-2 h-10 hover:bg-blue-50' key={item.id}>
            <td className='font-semibold'>{item.title}</td>
            <td className='hidden md:table-cell'>{item.class?.name || "All classes"}</td>
            <td className='hidden lg:table-cell'>{new Intl.DateTimeFormat('en-US').format(item.startDate)}</td>
            <td className='hidden lg:table-cell'>{item.startDate.toLocaleTimeString('en-US')}</td>
            <td className='hidden lg:table-cell'>{item.endDate.toLocaleTimeString('en-US')}</td>
            {/* ,{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            } */}
            <td>
                <div className='flex gap-3 items-center'>
                    {role === 'admin' && (
                        <>
                            <FormContainer table='event' type='delete' data={item} id={item.id} />
                            <FormContainer table='event' type='update' data={item} id={item.id} />
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
                <h1 className='font-semibold'>All Events</h1>
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
                            <FormContainer table='event' type='create' />
                        )}
                    </div>
                </div>
            </div>
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

export default EventsListPage;