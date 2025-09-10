import React from 'react'

export default function Table({columns, renderRow, data}: {columns: {headers:string, accessors: string, className?:string}[]; renderRow:(item:any)=>React.ReactNode; data:any[]}) {
  return (
    <div>
      <table className='w-full mt-4'>
        <thead>
            <tr className='text-left text-gray-500 text-sm bg-gray-300 h-10'>
                {columns.map((column, i)=>(
                    <th key={i} className={column.className}>{column.headers}</th>
                ))}
            </tr>
        </thead>
        <tbody>
          {data.map((item) => renderRow(item))}
        </tbody>
      </table>
    </div>
  )
}
