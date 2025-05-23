"use client"

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import Image from "next/image";


interface CountChartProps {
   boysCount: number;
   girlsCount: number;
 }
 
 const CountChart: React.FC<CountChartProps> = ({ boysCount, girlsCount }) => {
 
   const total = boysCount + girlsCount;
 
   const data = [
     {
       name: 'Girls',
       count: girlsCount,
       fill: '#FF9D3D',
     },
     {
       name: 'Total',
       count: total,
       fill: 'white',
     },
     {
       name: 'Boys',
       count: boysCount,
       fill: '#37AFE1',
     },
   ];
 
   return (
     <div className="bg-white dark:bg-black text-black dark:text-white transition-all duration-300 rounded-xl w-full h-full p-4">
       {/* Title */}
       <div className="flex justify-between items-center">
         <h1 className='text-lg font-semibold'>Students</h1>
         <Image src="/moreDark.png" alt="" width={20} height={20} />
       </div>
 
       {/* Chart */}
       <div className="relative w-full h-[75%]">
         <ResponsiveContainer>
           <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
             <RadialBar background dataKey="count" />
           </RadialBarChart>
         </ResponsiveContainer>
         <Image src="/maleFemale.png" alt="" width={50} height={50} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
       </div>
 
       {/* Bottom */}
       <div className="flex justify-center gap-16">
         <div className="flex flex-col gap-1">
           <div className="w-5 h-5 bg-syncSky rounded-full" />
           <h1 className='font-bold'>{boysCount}</h1>
           <h2 className='text-xs text-gray-300'>Boys ({total > 0 ? Math.round((boysCount / total) * 100) : 0}%)</h2>
         </div>
         <div className="flex flex-col gap-1">
           <div className="w-5 h-5 bg-syncOrange rounded-full" />
           <h1 className='font-bold'>{girlsCount}</h1>
           <h2 className='text-xs text-gray-300'>Girls ({total > 0 ? Math.round((girlsCount / total) * 100) : 0}%)</h2>
         </div>
       </div>
     </div>
   )
 }
 
 export default CountChart;
 