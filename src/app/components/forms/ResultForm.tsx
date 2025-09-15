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
const ResultForm = ({ type, data }: { type: "create" | "update"; data?: any; }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    return (
        <form onSubmit={handleSubmit((d) => console.log(d))} className='flex flex-col gap-2'>
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Result` : `Update Result`}</h1>
            <p>Form in development</p>
        </form>
    );
};

export default ResultForm;