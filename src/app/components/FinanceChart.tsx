'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
const data = [
  {
    name: 'Jan',
    income: 4000,
    expense: 2400,
  },
  {
    name: 'Feb',
    income: 3000,
    expense: 1398,
  },
  {
    name: 'Mar',
    income: 2000,
    expense: 9800,
  },
  {
    name: 'Apr',
    income: 2780,
    expense: 3908,
  },
  {
    name: 'May',
    income: 1890,
    expense: 4800,
  },
  {
    name: 'Jun',
    income: 2390,
    expense: 3800,
  },
  {
    name: 'Jul',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'Aug',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'Sep',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'Oct',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'Nov',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'Dec',
    income: 3490,
    expense: 4300,
  },
];

export default function FinanceChart() {
  return (
    <div className='h-full flex flex-col items-center p-3'>
        <motion.span
            className="mb-2 font-semibold"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
        >
            Finance
        </motion.span>
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" axisLine={false} tick={{fill: '#d1d5db'}} tickLine={false}/>
            <YAxis axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{borderRadius: '10px', borderColor: 'lightgray'}}/>
            <Legend align='left' verticalAlign='top' wrapperStyle={{paddingTop: '2px', paddingBottom: '14px'}} />
            <Line type="monotone" dataKey="expense" stroke="#FAE27C" activeDot={{ r: 8 }} legendType='circle'/>
            <Line type="monotone" dataKey="income" stroke="#C3EBFa" legendType='circle'/>
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
}