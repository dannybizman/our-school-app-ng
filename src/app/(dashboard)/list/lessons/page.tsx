"use client";

import { useEffect, useState } from "react";
import { Table, Button, Tooltip } from "antd";
import { DeleteOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { getAllLessons } from "@/utils/api";
import dayjs from "dayjs";
import Image from "next/image";
import { Lesson } from "@/types/lesson";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

const LessonListPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const role = useSelector((state: RootState) => state.role.value);
  const [mounted, setMounted] = useState(false)
  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };
  useRestoreRoleFromToken();


  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const paginatedLessons = lessons.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchLessons = async () => {
    try {
      dispatch(startLoading());
      const token = localStorage.getItem("token");
      const response = await getAllLessons(token);
      setLessons(response.lessons);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    } finally {
      dispatch(stopLoading());
    }
  };


  useEffect(() => {
    if (mounted) fetchLessons()
  }, [mounted])

  const refresh = fetchLessons;

  const columns = [
    {
      title: "Lesson Name",
      dataIndex: "name",
      key: "name",
      // responsive: ["sm"],
    },
    {
      title: "Subject Name",
      dataIndex: ["subjectId", "name"],
      key: "subjectId",
      // responsive: ["md"],
      render: (text: string) => text || "—",
    },
    {
      title: "Class",
      dataIndex: ["classId", "name"],
      key: "classId",
      responsive: ["md"],
      render: (text: string) => text || "—",
    },
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      responsive: ["md"],
      render: (text: string) => text || "—",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      responsive: ["md"],
      render: (value: string) =>
        value ? dayjs(value).format("MMM D, YYYY hh:mm A") : "—",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      responsive: ["md"],
      render: (value: string) =>
        value ? dayjs(value).format("MMM D, YYYY hh:mm A") : "—",
    },
    {
      title: "Teacher",
      key: "teacherId",
      responsive: ["sm"],
      render: (_: any, record: Lesson) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.teacherId?.avatar?.url || "/default-avatar.png"}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <span>
            {record.teacherId
              ? `${record.teacherId.firstName} ${record.teacherId.lastName || ""}`
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Lesson) => (
        <div className="flex items-center gap-2">


          {hasPermission(["admin", "teacher"], role) &&
            <FormModal table="lesson" type="update" data={record} />}

          {hasPermission(["admin"], role) ? (
            <>
              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="lesson"
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
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h1 className="text-lg font-semibold hidden md:block">All Lessons</h1>

        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch />

          <div className="flex gap-3 items-center">
            <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
            <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
            {hasPermission(["admin", "teacher"], role) && <FormModal
              trigger={<button className="btn">Add Lesson</button>}
              table="lesson"
              type="create"
              refresh={fetchLessons}
            />}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={paginatedLessons}
        rowKey="_id"
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
        className="custom-ant-table"
      />

      {/* Pagination Section */}
      <Pagination
       current={currentPage}
       total={lessons.length}
       pageSize={pageSize}
       onChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default LessonListPage;
