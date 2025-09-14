'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import { createClass, updateClass } from '@/lib/action';
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react';
import { startTransition } from "react";
import { ClassSchema } from '@/lib/formValidatorSchema';
import { toast } from 'react-toastify';

//=======Class form zod action=========
type Inputs = z.infer<typeof ClassSchema>
const ClassForm = ({ type, data, setOpen, relatedData }:
    {
        type: "create" | "update"; data?: any; setOpen?: Dispatch<SetStateAction<boolean>>; relatedData: any;
    }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(ClassSchema),
        defaultValues: data || {}
    });

    const [state, formAction, isPending] = useActionState(
        type === "create" ? createClass : updateClass,
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
            setOpen(false);
    };

    useEffect(() => {
        if (state.success && setOpen) {
            setOpen(false);
            toast.success("Event created!", {
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
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Class` : `Update Class`}</h1>
            <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2 items-center'>
                <InputFormField label='Class Name' type='text' register={register("name")} defaultValue={data?.name} name='name' error={errors.name} />
                <div className='flex flex-col gap-2 py-2'>
                    <label>Select Supervisor</label>
                    <select id="teachers" {...register("supervisorId")} className="p-2 ring-1 ring-gray-500 rounded">
                        {relatedData.teachers.map((teacher: { id: string, name: string, surname: string }) => (
                            <option key={teacher.id} value={teacher.id}>{teacher.name + ' ' + teacher.surname}</option>
                        ))}
                    </select>
                    {errors?.supervisorId && <p className="text-xs text-red-500">{errors.supervisorId.message}</p>}
                </div>
                <div className='flex flex-col gap-2 py-2'>
                    <label>Select Grade</label>
                    <select id="grades" {...register("gradeId")} className="p-2 ring-1 ring-gray-300 rounded">
                        {relatedData.grades.map((grade: { id: string, level: string }) => (
                            <option key={grade.id} value={grade.id}>{grade.level}</option>
                        ))}
                    </select>
                    {errors?.gradeId && <p className="text-xs text-red-500">{errors.gradeId.message}</p>}
                </div>
                {data && (
                    <input
                        type="hidden"
                        {...register("id", { valueAsNumber: true })}
                        defaultValue={data?.id}
                    />
                )}
            </div>
            <button type="submit" disabled={isPending} className='bg-blue-400 w-full md:w-20 p-2 rounded-md'>
                {isPending ? 'Saving...' : type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    );
};

export default ClassForm;