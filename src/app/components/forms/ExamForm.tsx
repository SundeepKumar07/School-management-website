'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import { examSchema } from '@/lib/formValidatorSchema';
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from 'react';
import { createExam, updateExam } from '@/lib/action';
import { formatDateForInput } from '@/lib/setting';
import { toast } from 'react-toastify';

//=========zod resolver==============
type Inputs = z.infer<typeof examSchema>
const ExamForm = ({ type, data, setOpen, relatedData }:
    {
        type: "create" | "update"; data?: any; setOpen?: Dispatch<SetStateAction<boolean>>; relatedData: any;
    }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(examSchema),
        defaultValues: data
            ? {
                id: data.id,
                title: data.title,
                startTime: data.startTime
                    ? formatDateForInput(new Date(data.startTime))
                    : "",
                endTime: data.endTime
                    ? formatDateForInput(new Date(data.endTime))
                    : "",
                lessonId: data.lessonId,
            }
            : {},
    });

    const [state, formAction, isPending] = useActionState(
        type === "create" ? createExam : updateExam,
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
            toast.success("Exam created!", {
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
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Exam` : `Update Exam`}</h1>
            {data && (
                <input
                    type="hidden"
                    {...register("id")}
                />
            )}
            <div className=''>
                <h1 className='text-gray-400 pb-1 pt-2 text-sm'>Fill information bellow</h1>
                <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <InputFormField label='Title' type='text' register={register("title")} name='title' error={errors.title} />
                    <div className='flex flex-col gap-2'>
                        <label>Select Lesson</label>
                        <select id="lessonId" {...register("lessonId")} className="p-2 ring-1 ring-gray-300 rounded">
                            {relatedData.lessons.map((lesson: { id: number, name: string }) => (
                                <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
                            ))}
                        </select>
                        {errors?.lessonId && <p className="text-xs text-red-500">{errors.lessonId.message}</p>}
                    </div>
                    <InputFormField label='Start Time' type='datetime-local' register={register("startTime")} name='startTime' error={errors.startTime} />
                    <InputFormField label='End Time' type='datetime-local' register={register("endTime")} name='endTime' error={errors.endTime} />
                </div>
            </div>
            <button type="submit" disabled={isPending} className='bg-blue-400 w-full md:w-20 p-2 rounded-md'>
                {isPending ? 'Saving...' : type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    );
};

export default ExamForm;