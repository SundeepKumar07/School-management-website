import AttendenceFilterContainer from '@/app/components/AttendenceFilterContainer';
import AttendenceForm from '@/app/components/forms/AttendenceForm';
import { Prisma, Student } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import React from 'react'

const MarkAttendencePage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined }}) => {
  let students: Student[] = [];
  const queryParams = await searchParams;
  const query: Prisma.StudentWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'lessonId':
            query.class = {
              lessons: {
                some: {
                  id: parseInt(value),
                }
              }
            }
            break;
          case 'classId':
            query.classId = parseInt(value);
            break;
          default:
            break;
        }
      }
    }
  }
  if (queryParams.lessonId) {
    const [data, count] = await prisma.$transaction([
      prisma.student.findMany({
        where: query,
        include: {
          class: {select: {name: true}}
        }
      }),
      prisma.student.count({ where: query })
    ])
    students = data;
  }

  return (
    <div>
      <AttendenceFilterContainer />
      <div>
        {students.length !== 0?
          <AttendenceForm students={students} lessonId={queryParams.lessonId}/>
          : queryParams.lessonId && students.length === 0?
            <div className='flex items-center justify-center text-xl font-semibold h-10 m-2'>Student Not found</div>
          : <div className='flex items-center justify-center text-xl font-semibold h-10 m-2'>Select both class and lesson</div>
        }
      </div>
    </div>
  )
}

export default MarkAttendencePage;
