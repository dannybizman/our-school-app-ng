"use client"
import { useEffect, useState } from "react";
import { Table, Button, Input, Space, Tooltip, Avatar } from "antd";
import { DeleteOutlined, EyeOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import { getAllParents, getAllStudents } from "@/utils/api";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import Image from "next/image";
import type { ColumnsType } from "antd/es/table";
import TableSearch from "@/components/TableSearch";
import { Parent } from '@/types/parent';
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";
import { Student } from "@/types/student";
import Link from "next/link";



const ParentListPage = () => {
  const [mounted, setMounted] = useState(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [students, setStudents] = useState<Student[]>([]);
  const role = useSelector((state: RootState) => state.role.value);
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };
  useRestoreRoleFromToken();


  useEffect(() => {
    setMounted(true);
  }, []);


  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const paginatedParents = parents.slice((currentPage - 1) * pageSize, currentPage * pageSize);



  const fetchParents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      dispatch(startLoading());
      const res = await getAllParents(token);
      setParents(res.data?.parents || []);
    } catch (error) {
      enqueueSnackbar("Failed to fetch parents", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Failed to fetch parents" variant="error" />
        ),
      });
      console.error(error);
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    if (!mounted) return;
    fetchParents();
  }, [mounted]);

  const refresh = fetchParents;





  useEffect(() => {
    const fetchDropdownData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const [studentsRes] = await Promise.all([getAllStudents(token)]);
        setStudents(studentsRes.data?.students ?? []);
      } catch (err) {
        enqueueSnackbar("Failed to load students", {
          variant: "error",
          content: (key) => (
            <CustomSnackbar id={key} message="Failed to load students" variant="error" />
          ),
        });
      }
    };
    if (mounted) fetchDropdownData();
  }, [mounted]);

  const formatId = (id: string) => {
    if (!id || id.length < 7) return id;
    return `${id.slice(0, 5)}${id.slice(-2)}`;
  };



  const getStudentsNames = (studentObjs: any[]) => {
    return studentObjs
      .map((student) => {
        if (student.firstName && student.lastName) {
          return `${student.firstName} ${student.lastName}`;
        }
        const studentData = students.find((s) => s._id === student || s._id === student?._id);
        if (studentData) {
          return `${studentData.firstName} ${studentData.lastName}`;
        }

        return null;
      })
      .filter(Boolean)
      .join(", ");
  };



  const columns = [
    {
      title: "Info",
      dataIndex: "info",
      key: "info",
      render: (_: any, item: Parent) => (
        <div className="flex items-center gap-3">
          <Avatar src={item.avatar?.url || "/default-avatar.png"} size={40} />
          <div>
            <div className="font-medium">{item.firstName} {item.lastName}</div>
            <div className="text-xs text-gray-500">{item.email}</div>
          </div>
        </div>
      ),
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
    {
      title: "Parent ID",
      dataIndex: "_id",
      key: "parentId",
      render: (id: string) => formatId(id),
      responsive: ['sm', 'md'],
    },
    {
      title: "Children",
      dataIndex: "students",
      key: "students",
      render: (students: any[]) => getStudentsNames(students) || "—",
      responsive: ['sm', 'md'],
    },


    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phone",
      responsive: ['lg'],
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      responsive: ['lg'],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, item: Parent) => (
        <div className="flex gap-2">
          {hasPermission(["admin", "teacher"], role) &&
            <Tooltip title="edit">
              <FormModal table="parent" type="update" data={item} refresh={refresh} />
            </Tooltip>}
          {hasPermission(["admin"], role) ? (
            <>
              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="parent"
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
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
  ];

  if (!mounted) return null;
  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0 dark:bg-black text-black dark:text-white transition-all duration-300'>
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
            <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
            {hasPermission(["admin"], role) && (
              <FormModal
                trigger={<button className="btn">Add Parent</button>}
                table="parent"
                type="create"
                refresh={refresh}
              />
            )}
          </div>
        </div>
      </div>

      {/* List Section */}
      <Table
        columns={columns}
        dataSource={paginatedParents}
        loading={loading}
        rowKey="_id"
        scroll={{ x: 'max-content' }}
        pagination={false}
      />

      <Pagination
        current={currentPage}
        total={parents.length}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}

export default ParentListPage;