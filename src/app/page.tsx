import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider"; // Import ThemeProvider
import Image from "next/image";

const Homepage = () => {
  return (
    <ThemeProvider> {/* ThemeProvider wraps everything */}
      <Header />
      <div className="min-h-screen flex flex-col items-center text-center pt-20 dark:bg-black bg-white">
        <section className="relative flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 py-20 bg-gradient-to-br 
        from-white to-purple-100 dark:bg-gradient-br dark:from-black dark:to-black dark:text-white">

          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              Transforming how teachers, <br /> parents, and students <br /> connect and collaborate.
            </h1>
            <p className="mt-6 text-gray-600 dark:text-white text-lg">
              Revolutionizing school communication and management with modern technology.
              Our School NG app streamlines collaboration between teachers, parents,
              and students—ensuring seamless learning,
              real-time updates, and smarter school management for primary and nursery schools in Nigeria.
            </p>
            <button className="mt-7 px-6 py-3 bg-syncSky dark:bg-syncPurple dark:text-black text-white 
              text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out 
              hover:text-black dark:hover:text-white hover:bg-syncPurpleLight dark:hover:bg-syncSkyLight hover:shadow-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 active:scale-95">
              Manage School Account
            </button>
          </div>

          {/* Right Images */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0">
            <div className="grid grid-cols-2 gap-4 relative w-[90%] sm:w-[80%] lg:w-[70%] xl:w-[60%]">
              {/* Image 1 */}
              <div className="rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                <Image
                  src="/image1.jpg"
                  alt="Meeting"
                  width={612}
                  height={480}

                />
              </div>
              {/* Image 2 */}
              <div className="rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                <Image
                  src="/image2.jpg"
                  alt="Teamwork"
                  width={612}
                  height={480}
                />
              </div>
              {/* Image 3 */}
              <div className="rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                <Image
                  src="/image3.jpg"
                  alt="Office"
                  width={540}
                  height={360}

                />
              </div>
              {/* Image 4 */}
              <div className="rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                <Image
                  src="/image4.jpg"
                  alt="Discussion"
                  width={540}
                  height={360}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section II */}
        <section className="relative bg-white dark:bg-black about-us">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="flex items-center space-x-3 text-sm font-medium text-gray-600 flex-col sm:flex-row sm:space-x-4">
                  <span className="text-indigo-600 dark:text-white">About us</span>
                  <button className="flex items-center space-x-1 text-gray-600 dark:text-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100">
                    <span>Learn more</span>
                    <span>→</span>
                  </button>
                </div>
                <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Streamline school management and enhance learning with Our School NG
                </h1>
                <p className="mt-4 text-md text-gray-600 dark:text-white">
                  Parents gain real-time insights into their children's academic growth, while school administrators
                  can track and evaluate teachers' performance to ensure quality education.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-x-0 sm:space-x-4">
                  <button className="px-6 py-3 bg-syncSky dark:bg-syncPurple dark:text-black text-white 
              text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out 
              hover:text-black dark:hover:text-white hover:bg-syncPurpleLight dark:hover:bg-syncSkyLight hover:shadow-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 active:scale-95">
                    Register your school
                  </button>
                  <button className="mt-3 sm:mt-0 text-gray-900 font-medium flex items-center space-x-1 hover:underline">
                    <span>See Pricing</span>
                    <span>→</span>
                  </button>
                </div>

              </div>

              {/* Right Side - Mobile Image Only */}
              <div className="relative flex justify-center">
                <div className="w-[540] h-[360] rounded-[40px] overflow-hidden shadow-lg">
                  <Image
                    src="/image3.jpg"
                    alt="Mobile App Screenshot"
                    width={540}
                    height={360}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </ThemeProvider>
  );
};

export default Homepage;
