"use client"

import { useEffect, useState } from "react"
import { Table, Badge, Button, Tooltip } from "antd"
import { DeleteOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons"
import moment from "moment"
import { useSnackbar } from "notistack"
import CustomSnackbar from "@/components/CustomSnackbar"
import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import TableSearch from "@/components/TableSearch"
import { getAllAttendances } from "@/utils/api"
import { Attendance } from "@/types/attendance"
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

const AttendanceListPage = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.role.value);
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const { enqueueSnackbar } = useSnackbar()
  const [mounted, setMounted] = useState(false)
  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };

  useRestoreRoleFromToken();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const paginatedAttendances = attendances.slice((currentPage - 1) * pageSize, currentPage * pageSize);



  useEffect(() => {
    setMounted(true)
  }, [])


  const fetchAttendances = async () => {
    dispatch(startLoading());
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await getAllAttendances(token)
      if (response.data.success) {
        setAttendances(response.data.attendances || [])
      } else {
        enqueueSnackbar("Failed to fetch attendances.", {
          variant: "error",
          content: (key) => (
            <CustomSnackbar id={key} message="Failed to fetch attendances." variant="error" />
          ),
        })
      }
    } catch (error) {
      console.error(error)
      enqueueSnackbar("Error fetching attendances.", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Error fetching attendances." variant="error" />
        ),
      })
    } finally {
      dispatch(stopLoading());
    }
  }

  useEffect(() => {
    if (mounted) fetchAttendances()
  }, [mounted])

  const refresh = fetchAttendances;


  const columns = [
    {
      title: "Student",
      dataIndex: "studentId",
      key: "student",
      responsive: ["sm", "md"],
      render: (studentId: any) =>
        typeof studentId !== "string"
          ? `${studentId.firstName} ${studentId.lastName}`
          : "N/A",
    },
    {
      title: "Class",
      dataIndex: "lessonId",
      key: "class",
      responsive: ["sm", "md"],
      render: (lessonId: any) =>
        typeof lessonId !== "string" && lessonId.classId
          ? typeof lessonId.classId !== "string"
            ? lessonId.classId.name
            : "Class ID"
          : "N/A",
    },
    {
      title: "Attendance",
      dataIndex: "present",
      key: "attendance",
      responsive: ["md"],
      render: (present: boolean) => (
        <Badge status={present ? "success" : "error"} text={present ? "Present" : "Absent"} />
      ),
    },
    {
      title: "Lesson",
      dataIndex: "lessonId",
      key: "lesson",
      responsive: ["md"],
      render: (lessonId: any) =>
        typeof lessonId !== "string" ? lessonId.name : "N/A",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      responsive: ["md"],
      render: (date: string) => moment(date).format("MMM Do, YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Attendance) => (
        <div className="flex items-start gap-2">
          {hasPermission(["admin", "teacher"], role) &&
            <FormModal table="attendance" type="update" data={record} />}


          {hasPermission(["admin"], role) ? (

            <>


              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="attendance"
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
  ]

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 dark:bg-black text-black dark:text-white transition-all duration-300">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Attendance</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3">
            <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
            <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
            {hasPermission(["admin", "teacher"], role) && <FormModal
              trigger={<button className="btn">Add Attendance</button>}
              table="attendance"
              type="create"
              refresh={refresh}
            />}
          </div>
        </div>
      </div>

      {/* List Section */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={paginatedAttendances}
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      {/* Pagination */}
      <Pagination
        current={currentPage}
        total={attendances.length}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}

export default AttendanceListPage
