"use client"

import { useEffect, useState } from "react"
import { Table, Avatar, Button, Tooltip } from "antd"
import { getAllStudents } from "@/utils/api"
import { Student } from "@/types/student"
import { FilterOutlined, SortAscendingOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons"
import { useSnackbar } from 'notistack'
import CustomSnackbar from "@/components/CustomSnackbar"
import Link from "next/link"
import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import TableSearch from "@/components/TableSearch"
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

const StudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const [mounted, setMounted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const role = useSelector((state: RootState) => state.role.value);
  const dispatch = useDispatch();
  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };

  useRestoreRoleFromToken();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const paginatedStudents = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);



  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchStudents = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      dispatch(startLoading());
      const data = await getAllStudents(token)
      setStudents(data)
    } catch (error) {
      enqueueSnackbar("Failed to fetch students", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Failed to fetch students" variant="error" />
        ),
      })
      console.error("Failed to fetch students", error)
    } finally {
      dispatch(stopLoading());
    }
  }

  useEffect(() => {
    if (mounted) fetchStudents()
  }, [mounted])

  const formatId = (id: string) => {
    if (!id || id.length < 7) return id
    return `${id.slice(0, 5)}${id.slice(-2)}`
  }


  const refresh = fetchStudents;

  const columns = [
    {
      title: "Info",
      dataIndex: "info",
      key: "info",
      render: (_: any, item: Student) => (
        <div className="flex items-center gap-3">
          <Avatar src={item.avatar?.url || "/default-avatar.png"} size={40} />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.firstName} {item.lastName}</h3>
            <p className="text-xs text-gray-500">{item.classId?.name}</p>
          </div>
        </div>
      ),
      responsive: ['xs', 'sm', 'md']
    },
    {
      title: "Student ID",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => formatId(id),
      responsive: ['sm', 'md']
    },
    {
      title: "Class",
      dataIndex: ["classId", "name"],
      key: "class",
      responsive: ['sm', 'md']
    },
    {
      title: "Grade",
      dataIndex: ["classId", "gradeLevel"],
      key: "grade",
      responsive: ['sm', 'md']
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      responsive: ['lg']
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, item: Student) => (
        <div className="flex gap-2">
          <Tooltip title="View">
            <Link href={`/list/students/${item._id}`}>
              <Button
                shape="circle"
                icon={<EyeOutlined />}
                type="primary"
                className="self-center"
              />
            </Link>
          </Tooltip>

          {hasPermission(["admin"], role) ? (
            <>
              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="student"
                  type="delete"
                  id={item._id}
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
      responsive: ['xs', 'sm', 'md', 'lg']
    },
  ]

  if (!mounted) return null

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0 dark:bg-black text-black dark:text-white transition-all duration-300'>

      {/* Top Section */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2">
            <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
            <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
            {hasPermission(["admin", "teacher"], role) && (
              // <FormModal table="student" type="create" />
              <FormModal
                trigger={<button className="btn">Add Student</button>}
                table="student"
                type="create"
                refresh={refresh}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={paginatedStudents}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />

      {/* Pagination */}
      <Pagination 
      current={currentPage}
      total={students.length}
      pageSize={pageSize}
      onChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}

export default StudentListPage
