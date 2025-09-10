'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import InputFormField from '../InputFormField';
import Image from 'next/image';
import { lessontSchema } from '@/lib/formValidatorSchema';

//===========zod resolver=========
type Inputs = z.infer<typeof lessontSchema>
const LessonForm = ({ type, data }: { type: "create" | "update"; data?: any; }) => {
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
                    ? new Date(data.startTime).toISOString().slice(0, 16)
                    : "",
                endTime: data.endTime
                    ? new Date(data.endTime).toISOString().slice(0, 16)
                    : "",
                subjectId: data.subjectId,
                classId: data.classId ? data.classId : '',
                teacherId: data.teacherId ? data.teacherId : '',
            }
            : {},
    });

    return (
        <form onSubmit={handleSubmit((d) => console.log(d))} className='flex flex-col gap-2'>
            <h1 className='text-xl font-semibold'>{type === 'create' ? `Create new Lesson` : `Update Lesson`}</h1>
            {data && (
                <input
                    type="hidden"
                    {...register("id")}
                    defaultValue={data?.id}
                />
            )}
            <div className=''>
                <h1 className='text-gray-400 pb-1 pt-2 text-sm'>Fill information bellow</h1>
                <div className='text-xs grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <InputFormField label='name' type='text' register={register("name")} name='name' error={errors.name} />
                    <div className='flex flex-col gap-2'>
                        <label>Select Gender</label>
                        <select id="day" {...register("day")} className="p-2 ring-1 ring-gray-500 rounded">
                            <option value="MONDAY">Monday</option>
                            <option value="TUESDAY">Tuesday</option>
                            <option value="WEDNESDAY">Wednesday</option>
                            <option value="THURSDAY">Thursday</option>
                            <option value="FRIDAY">Friday</option>
                        </select>
                        {errors?.day && <p className="text-xs text-red-500">{errors.day.message}</p>}
                    </div>
                    <InputFormField label='Start Time' type='datetime-local' register={register("startTime")} name='startTime' error={errors.startTime} />
                    <InputFormField label='End Time' type='datetime-local' register={register("endTime")} name='endTime' error={errors.endTime} />
                </div>
            </div>
            <input type="submit" className='bg-blue-500 text-white w-full md:w-1/6 p-2 rounded-md font-bold' />
        </form>
    );
};

export default LessonForm;