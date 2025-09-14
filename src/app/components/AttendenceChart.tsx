'use client';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        <Bar dataKey="absent" fill="#3498db" activeBar={<Rectangle fill="#3498db" stroke="#3498db" />} legendType='circle' radius={[10, 10, 0, 0]} />
        <Bar dataKey="present" fill="#19c31f" activeBar={<Rectangle fill="#19c31f" stroke="#19c31f" />} legendType='circle' radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendenceChart;