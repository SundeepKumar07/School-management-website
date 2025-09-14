'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import { eventSchema } from '@/lib/formValidatorSchema';
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from 'react';
import { createEvent, updateEvent } from '@/lib/action';
import { formatDateForInput } from '@/lib/setting';
import { toast } from 'react-toastify';

type Inputs = z.infer<typeof eventSchema>
const EventForm = ({ type, data, setOpen, relatedData }:
    {
        type: "create" | "update"; data?: any; setOpen?: Dispatch<SetStateAction<boolean>>; relatedData: any;
    }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(eventSchema),
        defaultValues: data
            ? {
                id: data.id,
                title: data.title,
                description: data.description,
                startDate: data.startDate
                    ? formatDateForInput(new Date(data.startDate))
                    : "",
                endDate: data.endDate
                    ? formatDateForInput(new Date(data.endDate))
                    : "",
                classId: data.classId || '',
            }
            : {},
    });

    const [state, formAction, isPending] = useActionState(
        type === "create" ? createEvent : updateEvent,
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
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Event` : `Update Event`}</h1>
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
                        <label>Select Class</label>
                        <select id="classId" {...register("classId")} className="p-2 ring-1 ring-gray-300 rounded">
                            <option value=''>All Classes</option>
                            {relatedData.classes.map((cl: { id: number, name: string }) => (
                                <option key={cl.id} value={cl.id}>{cl.name}</option>
                            ))}
                        </select>
                        {errors?.classId && <p className="text-xs text-red-500">{errors.classId.message}</p>}
                    </div>
                    <InputFormField label='Start Date' type='datetime-local' register={register("startDate")} name='startDate' error={errors.startDate} />
                    <InputFormField label='End Date' type='datetime-local' register={register("endDate")} name='endDate' error={errors.endDate} />
                </div>
                <div className='flex flex-col gap-2 pt-2'>
                    <label className=' text-sm text-gray-700'>Description</label>
                    <textarea {...register('description')} name={'description'} className='ring-1 ring-gray-400 p-2 rounded-md' />
                    {errors?.description && <p className='text-xs text-red-500'>{errors.description.message}</p>}
                </div>
            </div>
            <button type="submit" disabled={isPending} className='bg-blue-400 w-full md:w-20 p-2 rounded-md'>
                {isPending ? 'Saving...' : type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    );
};

export default EventForm;