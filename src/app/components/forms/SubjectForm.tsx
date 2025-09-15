'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import { createSubject, updateSubject } from '@/lib/action';
import { SubjectSchema } from '@/lib/formValidatorSchema';
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react';
import { startTransition } from "react";
import { toast } from 'react-toastify';

//=======Subject form zod action=========
type Inputs = z.infer<typeof SubjectSchema>
const SubjectForm = ({ type, data, setOpen, teachers }: { type: "create" | "update"; data?: any; setOpen?: Dispatch<SetStateAction<boolean>>; teachers: any[]; }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(SubjectSchema),
        defaultValues: data || {}
    });

    const [state, formAction, isPending] = useActionState(
        type === "create" ? createSubject : updateSubject,
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
        if(setOpen !== undefined)
        setOpen(false);
    };

    useEffect(() => {
        if (state.success && setOpen) {
            setOpen(false);
            toast.success("Subject created!", {
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
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Subject` : `Update Subject`}</h1>
            <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2'>
                <InputFormField label='Subject Name' type='text' register={register("name")} defaultValue={data?.name} name='name' error={errors.name} />
                <div className='flex flex-col gap-2 py-2 items-center'>
                    <label>Select Teacher</label>
                    <select multiple id="teachers" {...register("teachers")} className="p-2 ring-1 ring-gray-500">
                        {teachers.map((teacher: {id: string, name: string, surname: string})=> (
                            <option key={teacher.id} value={teacher.id}>{teacher.name + ' ' + teacher.surname}</option>
                        ))}
                    </select>
                    {errors?.teachers && <p className="text-xs text-red-500">{errors.teachers.message}</p>}
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

export default SubjectForm;