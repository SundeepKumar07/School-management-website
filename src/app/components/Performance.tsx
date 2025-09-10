"use client";
import React from 'react'
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
const data = [
  { name: 'Group A', value: 92, fill: '#9bff9b' },
  { name: 'Group B', value: 8, fill: '#fda7a7' },
];
export default function Performance() {
  return (
    <div className='h-full relative flex flex-col'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-semibold pl-2'>Peformance</h1>
        <Image src={'/moreDark.png'} alt='' width={20} height={20}/>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            fill="#8884d8"
            label
          />
        </PieChart>
      </ResponsiveContainer>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
        <h1 className='text-xl font-semibold'>9.2</h1>
        <p className='text-sm text-gray-400'>of 10 TSL</p>
      </div>
      <h1 className='font-medium absolute bottom-14 left-0 right-0 m-auto text-center'>
          1st Semester - 2nd Semester
      </h1>
    </div>
  )
}
