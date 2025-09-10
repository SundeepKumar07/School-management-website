'use client'
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function TableSearch() {
  const router = useRouter();
  const handleSubmti = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value;
    const params = new URLSearchParams(window.location.search);
    params.set('search', value.toString());
    router.push(`${window.location.pathname}?${params}`)
  }
  return (
    <div>
      <form onSubmit={handleSubmti}>
        <input type="text" placeholder='Search' className='rounded-2xl w-full md:w-60 ring-1 ring-gray-400 py-1 px-2 outline-none' />
      </form>
    </div>
  )
}
