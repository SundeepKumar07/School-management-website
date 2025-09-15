'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import { lessontSchema } from '@/lib/formValidatorSchema';
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from 'react';
import { createLesson, updateLesson } from '@/lib/action';
import { formatTimeForInput } from '@/lib/setting';
import { toast } from 'react-toastify';

//===========zod resolver=========
type Inputs = z.infer<typeof lessontSchema>
const LessonForm = ({ type, data, setOpen, relatedData }:
    {
        type: "create" | "update"; data?: any; setOpen?: Dispatch<SetStateAction<boolean>>; relatedData: any;
    }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(lessontSchema),
        defaultValues: data
            ? {
                id: data.id,
                name: data.name,
                day: data.day,
                startTime: data.startTime
                    ? formatTimeForInput(new Date(data.startTime))
                    : "",
                endTime: data.endTime
                    ? formatTimeForInput(new Date(data.endTime))
                    : "",
                subjectId: data.subjectId,
                classId: data.classId ? data.classId : '',
                teacherId: data.teacherId ? data.teacherId : '',
            }
            : {},
    });

    const [state, formAction, isPending] = useActionState(
        type === "create" ? createLesson : updateLesson,
        { success: false, error: false }
    );

    const onSubmit = async (values: Inputs) => {
        // turn react-hook-form values into FormData
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        formAction(formData);
        if (setOpen !== undefined)
            setOpen(false)
    };
    useEffect(() => {
        if (state.success && setOpen) {
            setOpen(false);
            toast.success("Lesson created!", {
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
    }, [state.success]);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Lesson` : `Update Lesson`}</h1>
            {data && (
                <input
                    type="hidden"
                    {...register("id")}
                />
            )}
            <div className=''>
                <h1 className='text-gray-400 pb-1 pt-2 text-sm'>Fill information bellow</h1>
                <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <InputFormField label='name' type='text' register={register("name")} name='name' error={errors.name} />
                    <div className='flex flex-col gap-2'>
                        <label>Select Day</label>
                        <select id="day" {...register("day")} className="p-2 ring-1 ring-gray-500 rounded">
                            <option value="MONDAY">Monday</option>
                            <option value="TUESDAY">Tuesday</option>
                            <option value="WEDNESDAY">Wednesday</option>
                            <option value="THURSDAY">Thursday</option>
                            <option value="FRIDAY">Friday</option>
                        </select>
                        {errors?.day && <p className="text-xs text-red-500">{errors.day.message}</p>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label>Select Teacher</label>
                        <select id="teacherId" {...register("teacherId")} className="p-2 ring-1 ring-gray-300 rounded">
                            {relatedData.teachers.map((teacher: { id: string, name: string, surname: string, }) => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name + " " + teacher.surname}</option>
                            ))}
                        </select>
                        {errors?.teacherId && <p className="text-xs text-red-500">{errors.teacherId.message}</p>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label>Select Class</label>
                        <select id="classId" {...register("classId")} className="p-2 ring-1 ring-gray-300 rounded">
                            {relatedData.classes.map((cl: { id: number, name: string }) => (
                                <option key={cl.id} value={cl.id}>{cl.name}</option>
                            ))}
                        </select>
                        {errors?.classId && <p className="text-xs text-red-500">{errors.classId.message}</p>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label>Select Subject</label>
                        <select id="subjectId" {...register("subjectId")} className="p-2 ring-1 ring-gray-300 rounded">
                            {relatedData.subjects.map((subject: { id: number, name: string }) => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                        {errors?.subjectId && <p className="text-xs text-red-500">{errors.subjectId.message}</p>}
                    </div>
                    <InputFormField label='Start Time' type='time' register={register("startTime")} name='startTime' error={errors.startTime} />
                    <InputFormField label='End Time' type='time' register={register("endTime")} name='endTime' error={errors.endTime} />
                </div>
            </div>
            <button type="submit" disabled={isPending} className='bg-blue-400 w-full md:w-20 p-2 rounded-md'>
                {isPending ? 'Saving...' : type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    );
};

export default LessonForm;