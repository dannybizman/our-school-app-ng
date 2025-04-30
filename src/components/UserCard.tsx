import Image from "next/image";
// import Link from "next/link";

const UserCard = ({ type }: { type: string }) => {
   return (
      <div className='rounded-2xl odd:bg-syncPurple even:bg-syncOrange p-4 flex-1 min-w-[130px]'>

         <div className="flex justify-between items-center">

            <span className="text-[10px] bg-white dark:bg-black dark:text-white transition-all duration-300px-2 py-1 rounded-full text-green-600">2025/26</span>
            <Image src="/more.png" width={20} height={20} alt="" />
         </div>
         <h1 className="text-2xl font-semibold my-4 text-white">1,304</h1>
         <h2 className="capitalize text-sm font-medium text-white">{type}s</h2>
      </div>
   )
}

export default UserCard