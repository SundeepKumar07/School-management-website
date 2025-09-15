import AttendenceFilterContainer from '@/app/components/AttendenceFilterContainer';
import AttendenceForm from '@/app/components/forms/AttendenceForm';
import { Prisma, Student } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import React from 'react'

const MarkAttendencePage = async (props: {
  params: Promise<{ slug?: string }>   // or whatever dynamic route shape
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) => {
  let students: Student[] = [];
  const searchParams = await props.searchParams

  // ✅ Normalize string[] -> string
  const normalized: { [key: string]: string | undefined } = {}
  for (const key in searchParams ?? {}) {
    const value = searchParams[key]
    normalized[key] = Array.isArray(value) ? value[0] : value
  }
  const queryParams = normalized;
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
          class: { select: { name: true } }
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
        {students.length !== 0 ?
          <AttendenceForm students={students} lessonId={queryParams.lessonId} />
          : queryParams.lessonId && students.length === 0 ?
            <div className='flex items-center justify-center text-xl font-semibold h-10 m-2'>Student Not found</div>
            : <div className='flex items-center justify-center text-xl font-semibold h-10 m-2'>Select both class and lesson</div>
        }
      </div>
    </div>
  )
}

export default MarkAttendencePage;
