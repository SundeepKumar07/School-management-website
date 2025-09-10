'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import { parentSchema } from '@/lib/formValidatorSchema';
import { Dispatch, SetStateAction, startTransition, useActionState } from 'react';
import { createParent, updateParent } from '@/lib/action';

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

    const [state, formAction] = useActionState(
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

        startTransition(() => {
            formAction(formData);
        });
        if (setOpen !== undefined)
            setOpen(false)
    };

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
            <input type="submit" className='bg-blue-500 text-white w-full md:w-1/6 p-2 rounded-md font-bold' />
        </form>
    );
};

export default ParentForm;