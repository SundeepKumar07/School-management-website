import React from 'react'
import { FieldError } from 'react-hook-form'

type InputFieldProps = {
    label: string,
    type: string,
    register: any,
    name: string,
    defaultValue?: string,
    error?: FieldError,
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}
export default function InputFormField({
    label,
    type = 'text',
    register,
    name,
    defaultValue,
    error,
    inputProps
}: InputFieldProps) {
  return (
    <div>
        <div className='flex flex-col gap-2'>
            <label>{label}</label>
            <input {...register} name={name} type={type} defaultValue={defaultValue} className='ring-1 ring-gray-400 p-2 rounded-md' />
            {error?.message && <p className='text-xs text-red-500'>{error?.message}</p>}
        </div>
    </div>
  )
}
