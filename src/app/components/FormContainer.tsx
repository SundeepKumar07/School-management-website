import React from 'react'
import FormModel from './FormModel';
import { fetchAllClasses, fetchAllGrades, fetchAllLessons, fetchAllParents, fetchAllSubjects, fetchAllTeachers } from '@/lib/fetchRelatedData';
export type Table = "teacher" |
    "student" |
    "parent" |
    "subject" |
    "class" |
    "lesson" |
    "exam" |
    "assignment" |
    "result" |
    "attendence" |
    "event" |
    "announcement";
export default async function FormContainer({ table, type, data, id }:
    {
        table: Table
        type: "create" | "update" | "delete";
        data?: any;
        id?: number;
    }) {
    let relatedData: any;
    switch (table) {
        case 'subject':
            relatedData = await fetchAllTeachers();
            break;
        case 'class':
            const fetchTeachers = await fetchAllTeachers();
            const fetchGrades = await fetchAllGrades();
            relatedData = { teachers: fetchTeachers, grades: fetchGrades };
            break;
        case 'teacher':
            const fetchlessons = await fetchAllLessons();
            const fetchSubjects = await fetchAllSubjects();
            const fetchClasses = await fetchAllClasses();
            relatedData = { lessons: fetchlessons, subjects: fetchSubjects, classes: fetchClasses };
            break;
        case 'student':
            const fetchStudentParents = await fetchAllParents();
            const fetchStudentClasses = await fetchAllClasses();
            const fetchStudentGrades = await fetchAllGrades();
            relatedData = { parents: fetchStudentParents, classes: fetchStudentClasses, grades: fetchStudentGrades };
            break;
        case 'lesson':
            const fetchLessonClass = await fetchAllClasses();
            const fetchLessonTeacher = await fetchAllTeachers();
            const fetchLessonSubject = await fetchAllSubjects();
            relatedData = { classes: fetchLessonClass, subjects: fetchLessonSubject, teachers: fetchLessonTeacher };
            break;
    }

    return (
        <FormModel table={table} data={data} id={id} type={type} relatedData={relatedData} />
    )
}
