'use client';
import dynamic from "next/dynamic";
import Image from "next/image";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import TeacherForm from "./forms/TeacherForm";
import StudentForm from "./forms/StudentForm";
import ParentForm from "./forms/ParentForm";
import SubjectForm from "./forms/SubjectForm";
import ClassForm from "./forms/ClassForm";
import LessonForm from "./forms/LessonForm";
import ExamForm from "./forms/ExamForm";
import AssignmentForm from "./forms/AssignmentForm";
import EventForm from "./forms/EventForm";
import ResultForm from "./forms/ResultForm";
import AnnouncementForm from "./forms/AnnouncementForm";
import { deleteAnnouncement, deleteAssignment, deleteClass, deleteEvent, deleteExam, deleteLesson, deleteParent, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/action";
import { Table } from "./FormContainer";
import { toast } from "react-toastify";

// const TeacherForm = dynamic(()=>import("./forms/TeacherForm"), {
//   loading: () => <h1>Loading...</h1>
// })

export default function FormModel({table, type, data, id, relatedData}: {
    table: Table;
    type: "create" | "update" | "delete";
    data?: any;
    id?: number | string;
    relatedData?: any;
  }) {
  const size = type === 'create'? 18: type === 'delete' ? 16: 18;
  const style = type === 'create'? 'bg-blue-100 p-2 rounded-full': type === 'delete'? 'pb-2' : 'bg-green-100';
  const [open, setOpen] = useState(false);

  //====delete Actions=====
  const deleteActionMap = {
    subject: deleteSubject,
    student: deleteStudent,
    parent: deleteParent,
    teacher: deleteTeacher,
    lesson: deleteLesson,
    assignment: deleteAssignment,
    class: deleteClass,
    exam: deleteExam,
    event: deleteEvent,
    result: deleteSubject,
    attendence: deleteSubject,
    announcement: deleteAnnouncement,
  }
  //=====rendering different components======
  const forms: {
    [key: string]: (
    type: "create" | "update",
    data?: any,
    setOpen?: Dispatch<SetStateAction<boolean>>,
    relatedData?: any
  ) => React.ReactNode;
  } = {
    teacher: (type, data, setOpen, relatedData) => <TeacherForm type={type} data={data} relatedData={relatedData} setOpen={setOpen}/>,
    student: (type, data, setOpen, relatedData) => <StudentForm type={type} data={data} relatedData={relatedData} setOpen={setOpen}/>,
    parent: (type, data, setOpen) => <ParentForm type={type} data={data} setOpen={setOpen}/>,
    subject: (type, data, setOpen, relatedData) => <SubjectForm type={type} data={data} setOpen={setOpen} teachers={relatedData || []}/>,
    class: (type, data, setOpen, relatedData) => <ClassForm type={type} data={data} relatedData={relatedData} setOpen={setOpen}/>,
    lesson: (type, data, setOpen, relatedData) => <LessonForm type={type} data={data} relatedData={relatedData} setOpen={setOpen} />,
    exam: (type, data, setOpen, relatedData) => <ExamForm type={type} data={data} relatedData={relatedData} setOpen={setOpen} />,
    assignment: (type, data, setOpen, relatedData) => <AssignmentForm type={type} data={data} relatedData={relatedData} setOpen={setOpen} />,
    event: (type, data, setOpen, relatedData) => <EventForm type={type} data={data} relatedData={relatedData} setOpen={setOpen}/>,
    result: (type, data) => <ResultForm type={type} data={data} />,
    announcement: (type, data, setOpen, relatedData) => <AnnouncementForm type={type} data={data} relatedData={relatedData} setOpen={setOpen}/>,
  }

  //======Form State========
  const [state, formAction] = useActionState(deleteActionMap[table], {success: false, error: false});

  //======component=========
  const Form = ()=>{
    return type === 'delete' && id != undefined
    ?
    <form action={formAction} className="flex flex-col gap-2 w-[100%] items-center">
      <input type="text" name="id" defaultValue={data.id} hidden/>
      <span>{`All data will be lost. Are you sure you want to delete ${table}`}</span>
      <button className="bg-red-500 text-white p-2 rounded-md">Delete</button>
    </form>
    : type === 'create' || type === 'update'? (
      forms[table](type, data, setOpen, relatedData)
    ) : "Form not found";
  }

  useEffect(() => {
    if (state.success) {
          toast.success("Attendence Marked!", {
            style: {
              background: "#e8f5e9",   // light green background
              color: "#2e7d32",        // text color
              border: "1px solid #4caf50",
              borderRadius: "8px",
            },
          })
        }
        if (state.error) {
      toast.error("Something went wrong!", {
        style: {
          background: "#ffebee",   // light red background
          color: "#b71c1c",
          border: "1px solid #f44336",
          borderRadius: "8px",
        },
      });
    }}, [state.success, state.error]);
  return (
    <>
      <div className="relative">
        <button onClick={()=> setOpen(true)} className={`${style} rounded-full`}>
          <Image src={`/${type}.png`} alt={`${type} png`} width={size} height={size} className="rounded-full cursor-pointer"/>
        </button>
      </div>
      {open &&
        <div className="w-screen min-h-screen absolute top-0 left-0 flex justify-center items-center bg-black/60 z-50">
          <div className="bg-white relative w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] p-4 rounded-md">
            <Form/>
            <button onClick={()=>setOpen(false)} className="absolute right-4 top-2 cursor-pointer p-2">
              <Image src={'/close.png'} alt="close" width={14} height={14}/>
            </button>
          </div>
        </div>
      }
    </>
  )
}
