'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import { parentSchema } from '@/lib/formValidatorSchema';
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from 'react';
import { createParent, updateParent } from '@/lib/action';
import { toast } from 'react-toastify';

type Inputs = z.infer<typeof parentSchema>
const ParentForm = ({ type, data, setOpen }: { type: "create" | "update"; data?: any; setOpen?: Dispatch<SetStateAction<boolean>>}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(parentSchema),
        defaultValues: data
            ? {
                id: data.id,
                username: data.username,
                email: data.email || '',
                password: "", // empty → optional on update
                firstName: data.name,
                lastName: data.surname,
                phone: data.phone,
                address: data.address,
            }
            : {},
    });

    const [state, formAction, isPending] = useActionState(
        type === "create" ? createParent : updateParent,
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
            toast.success("Parent created!", {
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
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Parent` : `Update Parent`}</h1>
            {data && (
                <input
                    type="hidden"
                    {...register("id")}
                    defaultValue={data?.id}
                />
            )}
            <div className=''>
                <h1 className='text-gray-400 pb-1 pt-2 text-sm'>Authentication Information</h1>
                <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <InputFormField label='username' type='text' register={register("username")} name='username' error={errors.username} />
                    <InputFormField label='email' type='email' defaultValue='' register={register("email")} name='email' error={errors.email} />
                    <InputFormField label='password' type='password' register={register("password")} name='password' error={errors.password} />
                </div>
            </div>
            <div>
                <h1 className='text-gray-400 pb-1 pt-2 text-sm'>Personal Information</h1>
                <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <InputFormField label='First Name' type='text' register={register("firstName")} name='firstName' error={errors.firstName} />
                    <InputFormField label='Last Name' type='text' register={register("lastName")} name='lastName' error={errors.lastName} />
                    <InputFormField label='Phone no' type='text' register={register("phone")} name='phone' error={errors.phone} />
                    <InputFormField label='Address' type='text' register={register("address")} name='address' error={errors.address} />
                </div>
            </div>
            <button type="submit" disabled={isPending} className='bg-blue-400 w-full md:w-20 p-2 rounded-md'>
                {isPending ? 'Saving...' : type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    );
};

export default ParentForm;