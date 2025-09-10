'use client';
import { ITEM_PER_PAGE } from '@/lib/setting'
import { useRouter } from 'next/navigation';
export default function Pagination({page, totalPage}:{page: number, totalPage: number}) {
  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < totalPage;
  const router = useRouter();
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${params}`)
  }
  return (
    <div className='flex justify-between items-center'>
      <button disabled={!hasPrev} onClick={()=>changePage(page - 1)} className='text-xs bg-gray-700 text-gray-100 disabled:bg-gray-400 disabled:text-black disabled:opacity-30 p-2 rounded-md w-12'>Prev</button>
      <div className='flex gap-1'>
        {Array.from({length: Math.ceil(totalPage / ITEM_PER_PAGE)}, (_, index) => {
          const pageIndex = index + 1;
          return <button key={pageIndex} onClick={()=>changePage(pageIndex)} className={`w-7 h-7 cursor-pointer bg-gray-400 text-white text-sm ${page === pageIndex? 'bg-gray-700' : 'bg-gray-300'}`}>{pageIndex}</button>
        })}
      </div>
      <button disabled={!hasNext} onClick={()=>changePage(page + 1)} className='text-xs bg-gray-700 text-gray-100 disabled:bg-gray-400 disabled:opacity-30 disabled:text-black py-2 rounded-md font-bold w-12'>Next</button>
    </div>
  )
}
