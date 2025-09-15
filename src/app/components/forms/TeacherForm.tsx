'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import Image from 'next/image';
import { teacherSchema } from '@/lib/formValidatorSchema';
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from 'react';
import { createTeacher, updateTeacher } from '@/lib/action';
import { CldUploadWidget } from 'next-cloudinary';
import { toast } from 'react-toastify';

type Inputs = z.infer<typeof teacherSchema>
const TeacherForm = ({ type, data, setOpen, relatedData }:
    {
        type: "create" | "update"; data?: any; setOpen?: Dispatch<SetStateAction<boolean>>; relatedData: any;
    }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(teacherSchema),
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
                birthday: data.birthday
                    ? new Date(data.birthday).toISOString().split("T")[0]
                    : "",
                bloodgroup: data.bloodgroup,
                gender: data.gender,
                subjects: data.subjects?.map((s: any) => s.id.toString()) ?? [],
                classes: data.classes?.map((c: any) => c.id.toString()) ?? [],
                lessons: data.lessons?.map((l: any) => l.id.toString()) ?? [],
            }
            : {},
    });

    const [state, formAction, isPending] = useActionState(
        type === "create" ? createTeacher : updateTeacher,
        { success: false, error: false }
    );

    const onSubmit = async (values: Inputs) => {
        // turn react-hook-form values into FormData
        const newData = {
            ...values,
            img: imgData?.secure_url || data?.img || undefined,
        }
        const formData = new FormData();
        Object.entries(newData).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        formAction(formData);
        if (setOpen !== undefined)
            setOpen(false)
    };

    const [imgData, setImgData] = useState<any>();
    useEffect(() => {
        if (state.success && setOpen) {
            setOpen(false);
            toast.success("Teacher created!", {
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
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Teacher` : `Update Teacher`}</h1>
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
                    <InputFormField label='Birthday' type='date' register={register("birthday")} name='birthday' error={errors.birthday} />
                    <InputFormField label='Blood Group' type='text' register={register("bloodgroup")} name='bloodgroup' error={errors.bloodgroup} />
                    <div className='flex flex-col gap-2'>
                        <label>Select Gender</label>
                        <select defaultValue={data && data.gender} id="gender" {...register("gender")} className="p-2 ring-1 ring-gray-500 rounded">
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                        {errors?.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
                    </div>
                </div>
            </div>
            <div>
                <h1 className='text-gray-400 pb-1 pt-2 text-sm'>Additional Information</h1>
                <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <div className='flex flex-col gap-2 py-2'>
                        <label>Select Subjects</label>
                        <select multiple id="subjectId" {...register("subjects")} className="p-2 ring-1 ring-gray-300 rounded">
                            {relatedData.subjects.map((subject: { id: string, name: string }) => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                        {errors?.subjects && <p className="text-xs text-red-500">{errors.subjects.message}</p>}
                    </div>
                    <div className='flex flex-col gap-2 py-2'>
                        <label>Select Classes</label>
                        <select multiple id="classesId" {...register("classes")} className="p-2 ring-1 ring-gray-300 rounded">
                            {relatedData.classes.map((cl: { id: string, name: string }) => (
                                <option key={cl.id} value={cl.id}>{cl.name}</option>
                            ))}
                        </select>
                        {errors?.classes && <p className="text-xs text-red-500">{errors.classes.message}</p>}
                    </div>
                    <div className='flex flex-col gap-2 py-2'>
                        <label>Select Lessons</label>
                        <select multiple id="lessonsId" {...register("lessons")} className="p-2 ring-1 ring-gray-300 rounded">
                            {relatedData.lessons.map((lesson: { id: string, name: string }) => (
                                <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
                            ))}
                        </select>
                        {errors?.lessons && <p className="text-xs text-red-500">{errors.lessons.message}</p>}
                    </div>
                    <div className='flex gap-2 py-2 pr-2'>
                        <CldUploadWidget uploadPreset="DevSchools" onSuccess={(result, widget) => {
                            setImgData(result?.info);
                            widget.close();
                        }}>
                            {({ open }) => {
                                return (
                                    <div className='flex gap-2 justify-center items-center' onClick={() => open()}>
                                        <Image src={'/upload.png'} alt='uploadImg' width={20} height={20} className='w-10 h-10' />
                                        <span className='text-green-500 cursor-pointer'>Upload Image</span>
                                    </div>
                                );
                            }}
                        </CldUploadWidget>
                    </div>
                    {state.error && <p className='text-xs text-red-500'>Something went Wrong</p>}
                </div>
            </div>
            <button type="submit" disabled={isPending} className='bg-blue-400 w-full md:w-20 p-2 rounded-md'>
                {isPending ? 'Saving...' : type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    );
};

export default TeacherForm;