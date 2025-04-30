import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider"; // Import ThemeProvider

const About = () => {
  return (
    <ThemeProvider> {/* ThemeProvider wraps everything */}
      <Header />
      <div className="min-h-screen flex flex-col items-center text-center pt-10 bg-white dark:bg-black text-black dark:text-white">
       
          <img src="/avatar.jpg" alt="Profile" className="w-20 h-20 rounded-full mt-12" />
          <h1 className="text-4xl font-bold mt-4 text-gray-900 dark:text-white">Welcome To Our School NG App</h1>
          <h3 className="text-gray-600 dark:text-gray-400 mt-4 max-w-xl">
            Our School NG is the leading school management software designed specifically for primary and nursery schools in Nigeria.
          </h3>



          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 mb-12">
            <img src="/image1.jpg" className="rounded-xl" alt="Image 1" />
            <img src="/image2.jpg" className="rounded-xl" alt="Image 2" />
            <img src="/image3.jpg" className="rounded-xl" alt="Image 3" />
            <img src="/image4.jpg" className="rounded-xl" alt="Image 4" />
          </div>
       

        <div className="py-4 sm:py-3 about-us">
          <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-center text-base/7 font-semibold  text-black dark:text-white">Effortlessly monitor students' academic progress and performance.</h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-black dark:text-white sm:text-5xl">
              The ultimate solution for modern education.
            </p>
            <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
              <div className="relative lg:row-span-2">
                <div className="absolute inset-px rounded-lg bg-white  dark:bg-black lg:rounded-l-[2rem]"></div>
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                  <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white  max-lg:text-center">
                      Mobile friendly
                    </p>
                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-white max-lg:text-center">
                      Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                    </p>
                  </div>
                  <div className="@container relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                    <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 dark:bg-white dark:border-white shadow-2xl">
                      <img
                        className="size-full object-cover object-top"
                        src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 lg:rounded-l-[2rem] "></div>
              </div>
              <div className="relative max-lg:row-start-1">
                <div className="absolute inset-px rounded-lg bg-white dark:bg-black max-lg:rounded-t-[2rem]"></div>
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                  <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white max-lg:text-center">Performance</p>
                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-white max-lg:text-center">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.
                    </p>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                    <img
                      className="w-full max-lg:max-w-xs"
                      src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                      alt=""
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-t-[2rem]"></div>
              </div>
              <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                <div className="absolute inset-px rounded-lg bg-white dark:bg-black"></div>
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                  <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white max-lg:text-center">Security</p>
                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-white max-lg:text-center">
                      Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.
                    </p>
                  </div>
                  <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                    <img
                      className="h-[min(152px,40cqw)] object-cover"
                      src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                      alt=""
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5"></div>
              </div>
              <div className="relative lg:row-span-2">
                <div className="absolute inset-px rounded-lg bg-white dark:bg-black max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                  <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white max-lg:text-center">
                      Responssive dashboard layout
                    </p>
                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-white max-lg:text-cente dak:text-whiter">
                      Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida.
                    </p>
                  </div>
                  <div className="relative min-h-[30rem] w-full grow">
                    <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 dark:bg-white shadow-2xl">
                      <div className="flex bg-gray-800/40 dark:bg-white ring-1 ring-white/5">
                        <div className="-mb-px flex text-sm/6 font-medium text-gray-400 dark:text-black">
                          <div className="border-r border-b dark:border-r dark:border-b border-r-white/10 dark:border-r-black border-b-white/20 dark:border-b-black bg-white/5  dark:bg-black/5 px-4 py-2 text-white dark:text-black">
                            NotificationSetting.jsx
                          </div>
                          <div className="border-r border-gray-600/10 dark:border-r dark:border-black-600/10 px-4 py-2">App.jsx</div>
                        </div>
                      </div>
                      <div className="px-6 pt-6 pb-14">{/* Your code example */}</div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5  dark:ring-white/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default About;