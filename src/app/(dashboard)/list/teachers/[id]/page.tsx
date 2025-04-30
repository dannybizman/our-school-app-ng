import Announcements from "@/components/Announcements"
import FormModal from "@/components/FormModal"
import Perfomance from "@/components/Perfomance"
import ScheduleCalendar from "@/components/ScheduleCalendar"
import Image from "next/image"
import Link from "next/link"


const SingleTeacherPage = () => {
  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
      {/* Left side */}
      <div className="w-full xl:w-2/3">
        {/* Top Section */}

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Teacher Info Card */}
          <div className="flex-1 flex gap-4 bg-syncSkyLight py-6 px-4 rounded-md">
            <div className="w-1/3">
              <Image src="https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover" />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="items-center flex gap-4">
                <h1 className="text-xl font-semibold">Daniel Effiong</h1>
                <FormModal table="teacher" type="update" data={{
                  id: 3,
                  username: "daVado",
                  firstName: "Mike",
                  lastName: "Geller",
                  email: "mike@geller.com",
                  password: "myPassword",
                  img:
                    "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  phone: "1234567890",
                  sex: "male",
                  bloodType: "AA",
                  address: "123 Main St, Anytown, USA",
                  birthday: "1997-13-04",
                }} />
              </div>
              <p className="text-sm text-gray-500">Lorem Ipsum es simplemente
                el texto de relleno de las
                imprentas y archivos de texto.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>A+</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>January 2025</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>user@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>+234813499</span>
                </div>
              </div>
            </div>
          </div>
          {/* Small Info Card */}
          <div className="flex flex-1 gap-4 justify-between flex-wrap">
            {/* Mini Cards */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold">2</h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Section */}

        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <ScheduleCalendar />
        </div>
      </div>

      {/* Right side */}

      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-white">
            <Link className="p-3 rounded-md bg-syncSkyLight" href="/">Teacher&apos;s Classes</Link>
            <Link className="p-3 rounded-md bg-syncPurpleLight" href="/">Teacher&apos;s Students</Link>
            <Link className="p-3 rounded-md bg-syncOrangeLight" href="/">Teacher&apos;s Lessons</Link>
            <Link className="p-3 rounded-md bg-lime-500" href="/">Teacher&apos;s Exams</Link>
            <Link className="p-3 rounded-md bg-indigo-500" href="/">Teacher&apos;s Assignments</Link>
          </div>
        </div>
        <Perfomance />
        <Announcements />
      </div>
    </div>

  )
}

export default SingleTeacherPage;