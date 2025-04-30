"use client";

import { useEffect, useState } from "react";
import { Table, Button, Tooltip } from "antd";
import { DeleteOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { getAllExams } from "@/utils/api";
import { Exam } from "@/types/exam";
import dayjs from "dayjs";
import CustomSnackbar from "@/components/CustomSnackbar";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

const ExamListPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false);
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.role.value);

  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };


  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const paginatedExams = exams.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  useRestoreRoleFromToken();

  useEffect(() => {
    setMounted(true)
  }, [])



  const fetchExams = async () => {
    try {
      dispatch(startLoading());
      const token = localStorage.getItem("token");
      const response = await getAllExams(token);
      setExams(response?.data?.exams || []);
    } catch (error) {
      enqueueSnackbar("Failed to fetch classes", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Failed to fetch classes" variant="error" />
        ),
      });
    } finally {
      dispatch(stopLoading());
    }
  };

  const refresh = fetchExams;

  useEffect(() => {
    if (mounted) fetchExams()
  }, [mounted])


  const columns = [
    {
      title: "Exam Title",
      dataIndex: "title",
      key: "title",
      responsive: ["sm"],
    },
    {
      title: "Subject",
      dataIndex: ["subjectId", "name"],
      key: "subject",
      responsive: ["sm"],
      render: (text: string) => text || "N/A",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      responsive: ["md"],
      render: (startTime: string) =>
        startTime ? dayjs(startTime).format("MMM D, YYYY hh:mm A") : "—",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      responsive: ["md"],
      render: (endTime: string) =>
        endTime ? dayjs(endTime).format("MMM D, YYYY hh:mm A") : "—",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Exam) => (
        <div className="flex items-center gap-2">


          {hasPermission(["admin", "teacher"], role) &&
            <FormModal table="exam" type="update" data={record} />
          }

          {hasPermission(["admin"], role) ? (
            <>
              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="exam"
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

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />

          <div className="flex items-center gap-3">
            <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
            <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />

            {hasPermission(["admin", "teacher"], role) && <FormModal table="exam" type="create" refresh={refresh} />}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={paginatedExams}
          loading={loading}
          rowKey="_id"
          pagination={false}
          scroll={{ x: "max-content" }}
          className="mt-4"
        />
      </div>
      <div className="mt-4">
        <Pagination
          current={currentPage}
          total={exams.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default ExamListPage;
