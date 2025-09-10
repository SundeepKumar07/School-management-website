'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import Image from 'next/image';
const schema = z.object({
    username: z.string()
        .min(3, { message: 'atleast 3 character are required' })
        .max(20, { message: 'You can use 20 character maximum' }),
    email: z.string().email({ message: 'use correct formate for email' }),
    password: z.string().min(8, { message: 'use atleast 8 character' }),
    firstName: z.string().min(3, { message: 'atleast 3 character are required' }),
    lastName: z.string().min(3, { message: 'atleast 3 character are required' }),
    phone: z.string().min(11, { message: 'atleast 11 character are required' }),
    address: z.string().min(1, { message: 'address is required' }),
    birthday: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    bloodgroup: z.string().min(2, { message: 'blood group is required' }),
    gender: z.enum(['male', 'female'], { message: 'gender is required' }),
    //   img: z.instanceof(File, {message: 'File is required'}),
    img: z
        .custom<FileList>()
        .refine((files) => files && files.length > 0, {
            message: "File is required",
        }),
});
type Inputs = z.infer<typeof schema>
const AnnouncementForm = ({ type, data }: { type: "create" | "update"; data?: any; }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    return (
        <form onSubmit={handleSubmit((d) => console.log(d))} className='flex flex-col gap-2'>
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Student` : `Update Student`}</h1>
            <div className=''>
                <h1 className='text-gray-400 pb-1 pt-2 text-sm'>Authentication Information</h1>
                <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <InputFormField label='username' type='text' register={register("username")} defaultValue={data?.name} name='username' error={errors.username} />
                    <InputFormField label='email' type='email' register={register("email")} defaultValue={data?.email} name='email' error={errors.email} />
                    <InputFormField label='password' type='password' register={register("password")} defaultValue={data?.password} name='password' error={errors.password} />
                </div>
            </div>
            <div>
                <h1 className='text-gray-400 pb-1 pt-2 text-sm'>Personal Information</h1>
                <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <InputFormField label='First Name' type='text' register={register("firstName")} defaultValue={data?.name.split(' ')[0]} name='firstName' error={errors.firstName} />
                    <InputFormField label='Last Name' type='text' register={register("lastName")} defaultValue={data?.name.split(' ')[1]} name='lastName' error={errors.lastName} />
                    <InputFormField label='Phone no' type='text' register={register("phone")} defaultValue={data?.phone} name='phone' error={errors.phone} />
                    <InputFormField label='Address' type='text' register={register("address")} defaultValue={data?.address} name='address' error={errors.address} />
                    <InputFormField label='Birthday' type='date' register={register("birthday")} defaultValue={data?.birthday} name='birthday' error={errors.birthday} />
                    <InputFormField label='Blood Group' type='text' register={register("bloodgroup")} defaultValue={data?.bloodgroup} name='bloodgroup' error={errors.bloodgroup} />
                </div>
                <div className='flex gap-2 justify-between pt-4'>
                    <div className='flex flex-col gap-2 py-2'>
                        <select id="gender" {...register("gender")} className="p-2 ring-1 ring-gray-500">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors?.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
                    </div>
                    <div className='flex gap-2 py-2 pr-2'>
                        <div className='flex gap-2 justify-center items-center'>
                            <Image src={'/upload.png'} alt='uploadImg' width={20} height={20} className='w-10 h-10' />
                            <label htmlFor="img" className='text-green-500 cursor-pointer'>Upload Image</label>
                            <input type="file" {...register("img")} className='hidden' id='img' />
                        </div>
                        {errors?.img && <p className="text-xs text-red-500">{errors.img.message}</p>}
                    </div>
                </div>
            </div>
            <input type="submit" className='bg-blue-500 text-white w-full md:w-1/6 p-2 rounded-md font-bold' />
        </form>
    );
};

export default AnnouncementForm;