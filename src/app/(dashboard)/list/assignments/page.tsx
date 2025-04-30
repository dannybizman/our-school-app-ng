"use client";

import { useEffect, useState } from "react";
import { getAllAssignments } from "@/utils/api";
import { Assignment } from "@/types/assignment";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { Table, Avatar, Button, Tooltip } from "antd";
import { DeleteOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

const AssignmentListPage = () => {
   const { enqueueSnackbar } = useSnackbar();
   const [assignments, setAssignments] = useState<Assignment[]>([]);
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


   const paginatedAssignments = assignments.slice((currentPage - 1) * pageSize, currentPage * pageSize);



   useEffect(() => {
      setMounted(true)
   }, [])

   const fetchAssignments = async () => {
      try {
         dispatch(startLoading());
         const token = localStorage.getItem("token");
         const response = await getAllAssignments(token || "");
         setAssignments(response.data.assignments);
      } catch (error: any) {
         enqueueSnackbar(error?.response?.data?.message || "Failed to fetch assignments", {
            variant: "error",
         });
      } finally {
         dispatch(stopLoading());
      }
   };


   useEffect(() => {
      if (mounted) fetchAssignments()
   }, [mounted]);

   const refresh = fetchAssignments;

   const columns = [
      {
         title: "Assignment Name",
         dataIndex: "title",
         key: "title",
         responsive: ["sm", "md"],
      },
      {
         title: "Subject Name",
         dataIndex: ["lessonId", "subjectId", "name"],
         key: "subject",
         responsive: ["sm", "md"],
         render: (text: string) => text || "—",
      },
      {
         title: "Class",
         dataIndex: ["lessonId", "classId", "name"],
         key: "class",
         responsive: ["sm", "md"],
         render: (text: string) => text || "—",
      },
      {
         title: "Teacher",
         key: "teacher",
         responsive: ["md"],
         render: (_: any, record: Assignment) => {
            const teacher = record.lessonId?.teacherId;
            return (
               <div className="flex items-center gap-3">
                  <Avatar
                     src={teacher?.avatar?.url || "/default-avatar.png"}
                     alt={`${teacher?.firstName || "N/A"} ${teacher?.lastName || "N/A"}`}
                  />
                  <span>
                     {teacher?.firstName || "N/A"} {teacher?.lastName || ""}
                  </span>
               </div>
            );
         },
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
         render: (_: any, record: Assignment) => (
            <div className="flex items-center gap-2">
               {hasPermission(["admin", "teacher"], role) &&
                  <FormModal table="assignment" type="update" data={record} />}

               {hasPermission(["admin"], role) ? (
                  <>
                     <Tooltip title="Delete">
                        <FormModal
                           trigger={<DeleteOutlined />}
                           table="assignment"
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

   if (!mounted) return null

   return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 dark:bg-black text-black dark:text-white transition-all duration-300">
         {/* Top Section */}
         <div className="flex items-center justify-between mb-4">
            <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
               <TableSearch />
               <div className="flex items-center gap-2">
                  <Button shape="circle" icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
                  <Button shape="circle" icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
                  {hasPermission(["admin", "teacher"], role) && <FormModal trigger={<button className="btn">Add Assignment</button>} table="assignment" type="create"
                     onSuccess={refresh}
                  />

                  }
               </div>
            </div>
         </div>

         <div className="mt-6">
            <Table
               columns={columns}
               dataSource={paginatedAssignments}
               rowKey="_id"
               loading={loading}
               pagination={false}
               scroll={{ x: "max-content" }}
               className="rounded-lg overflow-hidden"
            />
         </div>
         <div className="mt-4">
            <Pagination
               current={currentPage}
               total={assignments.length}
               pageSize={pageSize}
               onChange={(page) => setCurrentPage(page)}
            />
         </div>
      </div>
   );
};

export default AssignmentListPage;
