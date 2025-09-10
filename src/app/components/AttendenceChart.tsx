'use client';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data1 = [
  {
    name: 'Mon',
    present: 70,
    absent: 30,
  },
  {
    name: 'Tue',
    present: 40,
    absent: 60,
  },
  {
    name: 'Wed',
    present: 20,
    absent: 80,
  },
  {
    name: 'Thu',
    present: 20,
    absent: 80,
  },
  {
    name: 'Fri',
    present: 10,
    absent: 90,
  },
  {
    name: 'Sat',
    present: 60,
    absent: 40,
  },
];

const AttendenceChart = ({data}: any) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        barSize={20}
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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd' />
        <XAxis dataKey="name" axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
        <Legend align='left' verticalAlign='top' wrapperStyle={{ paddingTop: '2px', paddingBottom: '14px' }} />
        <Bar dataKey="absent" fill="#FAE27C" activeBar={<Rectangle fill="#FAE27C" stroke="#FAE27C" />} legendType='circle' radius={[10, 10, 0, 0]} />
        <Bar dataKey="present" fill="#C3EBFa" activeBar={<Rectangle fill="#C3EBFa" stroke="#C3EBFa" />} legendType='circle' radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendenceChart;