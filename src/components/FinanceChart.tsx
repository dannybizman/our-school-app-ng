"use client"

import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
   {
      name: 'Jan',
      income: 100000,
      expense: 80000,
   
   },
   {
      name: 'Feb',
      income: 85000,
      expense: 150000,

   },
   {
      name: 'Mar',
      income: 200000,
      expense: 90000,
    
   },
   {
      name: 'Apr',
      income: 720000,
      expense: 450000,
   
   },
   {
      name: 'May',
      income: 300000,
      expense: 150000,
   
   },
   {
      name: 'Jun',
      income: 200000,
      expense: 350000,
   
   },
   {
      name: 'Jul',
      income: 500000,
      expense: 250000,
  
   },
   {
      name: 'Aug',
      income: 720000,
      expense: 450000,
   
   },
   {
      name: 'Sept',
      income: 500000,
      expense: 300000,
    
   },
   {
      name: 'Oct',
      income: 300000,
      expense: 350000,
   
   },
   {
      name: 'Nov',
      income: 150000,
      expense: 350000,
    
   },
   {
      name: 'Dec',
      income: 720000,
      expense: 400000,
   
   },

  
];


const FinanceChart = () => {
   return (
      <div className=" bg-white dark:bg-black text-black dark:text-white transition-all duration-300 rounded-xl w-full h-full p-4">
         {/* Title */}
         <div className="flex justify-between items-center">
            <h1 className='text-lg font-semibold mb-5'>Finance</h1>
            <Image src="/moreDark.png" alt="" width={20} height={30} />
         </div>

         <ResponsiveContainer width="100%" height="90%">
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
               <CartesianGrid strokeDasharray="3 3" stroke={false} />
               <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={10} />
               <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={20} />
               <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
               <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }} />
               <Line type="monotone" dataKey="income" stroke="#FF9D3D" strokeWidth={1}   />
               <Line type="monotone" dataKey="expense" stroke="#37AFE1" strokeWidth={1} />
            </LineChart>
         </ResponsiveContainer>


      </div>
   )
}

export default FinanceChart;