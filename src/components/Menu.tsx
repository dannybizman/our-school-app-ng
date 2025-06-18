"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { MenuSection } from "@/types/menu";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
// import { setRole } from "@/redux/slices/roleSlice";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";
import GlobalLoader from "./common/GlobalLoader";
import { startLoading, stopLoading } from '@/redux/slices/loadingSlice';

const menuItems: MenuSection[] = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/admin", visible: ["admin"] },
      { icon: "/home.png", label: "Home", href: "/teacher", visible: ["teacher"] },
      { icon: "/home.png", label: "Home", href: "/parent", visible: ["parent"] },
      { icon: "/home.png", label: "Home", href: "/student", visible: ["student"] },
      { icon: "/teacher.png", label: "Teachers", href: "/list/teachers", visible: ["admin", "teacher", "parent", "student"] },
      { icon: "/student.png", label: "Students", href: "/list/students", visible: ["admin", "teacher"] },
      { icon: "/parent.png", label: "Parents", href: "/list/parents", visible: ["admin", "teacher"] },
      { icon: "/subject.png", label: "Subjects", href: "/list/subjects", visible: ["admin", "teacher", "student"] },
      { icon: "/class.png", label: "Classes", href: "/list/classes", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/lesson.png", label: "Lessons", href: "/list/lessons", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/exam.png", label: "Exams", href: "/list/exams", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/assignment.png", label: "Assignments", href: "/list/assignments", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/assignment.png", label: "Tests", href: "/list/tests", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/result.png", label: "Results", href: "/list/results", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/attendance.png", label: "Attendance", href: "/list/attendance", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/calendar.png", label: "Events", href: "/list/events", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/message.png", label: "Messages", href: "/list/messages", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: "/profile.png", label: "Profile", href: "/profile", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
];

const Menu = () => {
  const role = useSelector((state: RootState) => state.role.value);
  const normalizedRole = role?.toLowerCase?.() || "guest";
  const loaded = useSelector((state: RootState) => state.role.loaded);
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  

  useEffect(() => {
    console.log("Role state updated:", role, loaded);
  }, [role, loaded]);

  const handleLogout = () => {
    dispatch(startLoading());
    localStorage.removeItem("token");
    dispatch({ type: "RESET" });
    enqueueSnackbar("Logged out successfully", {
      variant: "success",
      content: (key, message) => (
        <CustomSnackbar id={key} message={String(message)} variant="success" />
      ),
    });
    router.push("/");
    dispatch(stopLoading());
  };


  if (!loaded) {
    return <GlobalLoader />; 
  }

  return (
    <div className="mt-4 text-sm dark:bg-black bg-white">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">{section.title}</span>
          {section.items.map((item) =>
           item.visible.includes(normalizedRole)
           ? (
              item.label === "Logout" ? (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center justify-center md:px-2 lg:justify-start gap-4 text-gray-500 py-2 rounded-md hover:bg-syncOrangeLight"
                >
                  {loading ? (
                    <Spin size="small" />
                  ) : (
                    <>
                      <Image src={item.icon} alt="" width={20} height={20} />
                      <span className="hidden lg:block">{item.label}</span>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center md:px-2 lg:justify-start gap-4 text-gray-500 py-2 rounded-md hover:bg-syncOrangeLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              )
            ) : null
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;
