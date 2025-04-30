"use client";

import { useEffect, useState } from "react";
import { getAllTests } from "@/utils/api";
import { Test } from "@/types/test";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { Table, Button, Tooltip } from "antd";
import { DeleteOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

const TestListPage = () => {
   const { enqueueSnackbar } = useSnackbar();
   const [tests, setTests] = useState<Test[]>([]);
   const [mounted, setMounted] = useState(false);

   const dispatch = useDispatch();
   const role = useSelector((state: RootState) => state.role.value);
   const loading = useSelector((state: RootState) => state.loading.isLoading);
   useRestoreRoleFromToken();
   const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
      return allowedRoles.includes(currentRole);
   };


   const [currentPage, setCurrentPage] = useState(1);
   const pageSize = 10;


   const paginatedTests = tests.slice((currentPage - 1) * pageSize, currentPage * pageSize);


   useEffect(() => {
      setMounted(true)
   }, [])

   const fetchTests = async () => {
      try {
         dispatch(startLoading());
         const token = localStorage.getItem("token");
         const response = await getAllTests(token || "");
         setTests(response.data.tests);
      } catch (error: any) {
         enqueueSnackbar(error?.response?.data?.message || "Failed to fetch tests", {
            variant: "error",
         });
      } finally {
         dispatch(stopLoading());
      }
   };

   useEffect(() => {
      if (mounted) fetchTests()
   }, [mounted]);



   const refresh = fetchTests;

   const columns = [
      {
         title: "Test Name",
         dataIndex: "title",
         key: "title",
         responsive: ["sm", "md"],
      },
      {
         title: "Subject Name",
         dataIndex: ["lessonId", "subjectId", "name"],
         key: "subject",
         responsive: ["sm", "md"],
         render: (text: any) => text || "—",
      },
      {
         title: "Class",
         dataIndex: ["lessonId", "classId", "name"],
         key: "class",
         responsive: ["sm", "md"],
         render: (text: any) => text || "—",
      },
      {
         title: "Teacher",
         key: "teacher",
         responsive: ["md"],
         render: (_: any, record: Test) => (
            <div className="flex items-center gap-3">
               <Image
                  src={record.lessonId?.teacherId?.avatar?.url || "/default-avatar.png"}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
               />
               <div>
                  <h3 className="font-semibold">
                     {record.lessonId?.teacherId?.firstName || "N/A"} {record.lessonId?.teacherId?.lastName || "N/A"}
                  </h3>
               </div>
            </div>
         ),
      },
      {
         title: "Start Date",
         dataIndex: "startDate",
         key: "startDate",
         render: (date: string) => date ? dayjs(date).format("MMM D, YYYY hh:mm A") : "—",
      },
      {
         title: "End Date",
         dataIndex: "endDate",
         key: "endDate",
         render: (date: string) => date ? dayjs(date).format("MMM D, YYYY hh:mm A") : "—",
      },
      {
         title: "Actions",
         key: "actions",
         render: (_: any, record: Test) => (
            <div className="flex gap-2">
               {hasPermission(["admin", "teacher"], role) &&
                  <FormModal table="test" type="update" data={record} />}

               {hasPermission(["admin"], role) ? (
                  <>


                     <Tooltip title="Delete">
                        <FormModal
                           trigger={<DeleteOutlined />}
                           table="test"
                           type="delete"
                           id={record._id}
                           refresh={refresh}
                        />
                     </Tooltip>
                  </>
               ) : (
                  <>
                     <Tooltip title="No permission">
                        <span className="text-gray-400 cursor-not-allowed">
                           <DeleteOutlined />
                        </span>
                     </Tooltip>
                  </>
               )}
            </div>
         ),
      },
   ];

   return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 dark:bg-black text-black dark:text-white transition-all duration-300">
         {/* Top Section */}
         <div className="flex items-center justify-between mb-4">
            <h1 className="hidden md:block text-lg font-semibold">All Tests</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
               <TableSearch />
               <div className="flex items-center gap-4 self-end">
                  <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
                  <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
                  {hasPermission(["admin", "teacher"], role) && <FormModal trigger={<button className="btn">Add Test</button>} table="test" type="create"
                     refresh={refresh}
                  />}
               </div>
            </div>
         </div>

         {/* AntD Table */}
         <Table
            columns={columns}
            dataSource={paginatedTests}
            rowKey="_id"
            loading={loading}
            pagination={false}
            scroll={{ x: "max-content" }}
            className="rounded-lg"
         />

         {/* Pagination */}
         <Pagination
            current={currentPage}
            total={tests.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
         />
      </div>
   );
};

export default TestListPage;
