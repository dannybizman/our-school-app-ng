"use client"


import { useEffect, useState } from "react";
import { Table, Avatar, Button, Tooltip } from "antd";
import { FilterOutlined, SortAscendingOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { getAllTeachers, getAllSubjects } from "@/utils/api";
import { Teacher } from "@/types/teacher";
import { Subject } from "@/types/subject";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";
import { UserRole } from "@/constants/roles";

const TeacherListPage = () => {
  const [mounted, setMounted] = useState(false);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
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


  const paginatedTeachersData = teachersData.slice((currentPage - 1) * pageSize, currentPage * pageSize);



  const fetchTeachers = async () => {

    try {
      dispatch(startLoading());
      const token = localStorage.getItem("token");
      const res = await getAllTeachers(token);
      setTeachersData(res.data?.teachers || []);
    } catch (error) {
      enqueueSnackbar("Failed to fetch teachers", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Failed to fetch teachers" variant="error" />
        ),
      });
      console.error(error);
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    if (!mounted) fetchTeachers();
  }, [mounted]);

  const refresh = fetchTeachers;

  useEffect(() => {
    const fetchDropdownData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const [subjectsRes] = await Promise.all([getAllSubjects(token)]);
        setSubjects(subjectsRes.data?.subjects ?? []);
      } catch (err) {
        enqueueSnackbar("Failed to load subjects", {
          variant: "error",
          content: (key) => (
            <CustomSnackbar id={key} message="Failed to load subjects" variant="error" />
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

  const getSubjectNames = (ids: any[]) => {
    return ids
      .map((s) => {
        const id = s?.$oid || s;
        return subjects.find((subj) => subj._id === id)?.name;
      })
      .filter(Boolean)
      .join(", ");
  };

  const columns = [
    {
      title: "Info",
      dataIndex: "info",
      key: "info",
      render: (_: any, item: Teacher) => (
        <div className="flex items-center gap-3">
          <Avatar src={item.avatar?.url || "/default-avatar.png"} 
          alt="avatar"
           width={36}
            height={36} 
            className="rounded-full object-cover" />
          <div>
            <div className="font-medium">{item.firstName} {item.lastName}</div>
            <div className="text-xs text-gray-500">{item.email}</div>
          </div>
        </div>
      ),
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
    {
      title: "Teacher ID",
      dataIndex: "_id",
      key: "teacherId",
      render: (id: string) => formatId(id),
      responsive: ['sm', 'md'],
    },
    {
      title: "Subjects",
      dataIndex: "subjects",
      key: "subjects",
      render: (ids: any[]) => getSubjectNames(ids) || "—",
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
      render: (_: any, item: Teacher) => (
        <div className="flex gap-2">
          <Tooltip title="View">
            <Link href={`/list/teachers/${item._id}`}>
              <Button icon={<EyeOutlined />} className="self-center" type="primary" shape="circle" />
            </Link>
          </Tooltip>
          {hasPermission(["admin"], role) ? (
            <>
              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="teacher"
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
    <div className="bg-white dark:bg-black text-black dark:text-white transition-all duration-300 p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h1 className="text-lg font-semibold hidden md:block">All Teachers</h1>
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          <TableSearch />
          <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
          <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
          {hasPermission(["admin"], role) && (
            <FormModal
              trigger={<button className="btn">Add Teacher</button>}
              table="teacher"
              type="create"
              refresh={fetchTeachers}
            />
          )}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={paginatedTeachersData}
        loading={loading}
        rowKey="_id"
        scroll={{ x: 'max-content' }}
        pagination={false}
      />

      <Pagination
        current={currentPage}
        total={teachersData.length}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default TeacherListPage;
