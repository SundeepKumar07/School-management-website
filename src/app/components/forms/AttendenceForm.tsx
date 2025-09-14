'use client';
import { z } from 'zod';
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { attendenceSchema } from "@/lib/formValidatorSchema";
import { createAttendence } from '@/lib/action';
import { Student } from '@/generated/prisma';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Inputs = z.infer<typeof attendenceSchema>
const AttendenceForm = ({ students, lessonId }: { students: any, lessonId: string | undefined }) => {
  const router = useRouter();
  const [data, setData] = useState<{ studentId: string[]; present: boolean[] } | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(attendenceSchema),

  });

  const [state, formAction, isPending] = useActionState(
    createAttendence,
    { success: false, error: false }
  );

  const onSubmit = async (values: Inputs) => {
    // turn react-hook-form values into FormData
    console.log(values)
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    formAction(formData);
    console.log(values)
  };

  const date = watch("date");
  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      const res = await fetch(`/api/attendence?lessonId=${lessonId}&date=${date}`);
      const fetched = await res.json();

      if (fetched.length > 0) {
        setData({
          studentId: fetched.map((a: any) => a.studentId),
          present: fetched.map((a: any) => a.present),
        });
      } else {
        setData({
          studentId: students.map((s: any) => s.id),
          present: students.map(() => true),
        });
      }
    };
    fetchData();
  }, [date, lessonId, students]);

  useEffect(() => {
    if (data) {
      data.studentId.forEach((id, index) => {
        setValue(`studentId.${index}`, id);                // set student id
        setValue(`present.${index}`, data.present[index]); // set present value
      });
    }
  }, [data, setValue]);

  useEffect(() => {
    if (state.success) {
      router.push("/list/attendance");
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
    }
  }, [state.success, state.error]);

  // data && console.log(data.present);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='p-2 sm:p-5 flex flex-col gap-3'>
      <div>
        <input type='date' {...register("date")} />
        {errors?.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
      </div>
      <input type="hidden" value={lessonId} {...register("lessonId", { valueAsNumber: true })} />
      <table>
        <thead>
          <tr className='bg-green-200 h-8 font-semibold text-sm sm:text-md'>
            <td className='pl-2'>ID</td>
            <td>Images</td>
            <td>Name</td>
            <td className='hidden sm:table-cell'>Email</td>
            <td>Present</td>
          </tr>
        </thead>
        <tbody className='text-sm sm:text-md'>
          {students.map((student: Student, index: number) => (
            <tr key={student.id} className='h-8 even:bg-white'>
              <td className='pl-2'>
                <input
                  type="hidden"
                  {...register(`studentId.${index}`)}
                  value={student.id}
                  className='w-2 sm:w-5'
                />
                {student.id}
              </td>
              <td>
                <Image src={student.img || '/noAvatar.png'} alt='imgage' width={20} height={20} className='rounded-full' />
              </td>
              <td>
                {student.name + " " + student.surname}
              </td>
              <td className='hidden sm:table-cell'>{student.email || 'Not Assigned'}</td>
              <td>
                <Controller
                  name={`present.${index}` as const}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                {errors?.present && <p className="text-xs text-red-500">{errors.present.message}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-end'>
        <button type='submit' className='font-semibold bg-green-500 px-2 py-1 right-0 w-full sm:w-20'>
          {isPending ? 'Saving...' : "Save"}
        </button>
      </div>
    </form>
  )
}

export default AttendenceForm