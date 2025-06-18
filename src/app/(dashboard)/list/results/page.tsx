"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Avatar, Space, Typography, message, Tooltip } from "antd";
import { FilterOutlined, SortAscendingOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { getAllResults } from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";
import { Result } from "@/types/result";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import { UserRole } from "@/constants/roles";

const { Text } = Typography;

const ResultListPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.role.value);
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };

  useRestoreRoleFromToken();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const paginatedResults = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchResults = async () => {
    dispatch(startLoading());
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await getAllResults(token);
      console.log("API Response:", response.data);
      if (response.data.success) {
        setResults(response.data.results || []);
      } else {
        enqueueSnackbar("Failed to fetch results.", {
          variant: "error",
          content: (key) => (
            <CustomSnackbar id={key} message="Failed to fetch results." variant="error" />
          ),
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error fetching results.", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Error fetching results." variant="error" />
        ),
      });
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    if (mounted) fetchResults()
  }, [mounted])


  const refresh = fetchResults;

  const getTotalScore = (item: Result) => {
    const exam = item.examScore ?? 0;
    const test = item.testScore ?? 0;
    const assignment = item.assignmentScore ?? 0;
    return exam + test + assignment;
  };

  const columns = [
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      responsive: ['xs', 'sm', 'md', 'lg'],
      render: (_: any, item: Result) => (
        <Space>
          <Avatar
            src={item.studentId.avatar?.url || "/default-avatar.png"}
            alt="avatar"
            size={40}
          />
          <div>
            <Text strong>
              {item.studentId.firstName} {item.studentId.lastName}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      responsive: ['sm'],
      render: (_: any, item: Result) =>
        item.testId ? item.testId.lessonId.classId.name : "-",
    },
    {
      title: "Exam",
      dataIndex: "exam",
      key: "exam",
      responsive: ['sm'],
      render: (_: any, item: Result) =>
        item.examId ? (
          <div>
            <Text strong>{item.examId.title}</Text>
            <div className="text-xs text-gray-500">{item.examId.subjectId?.name}</div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Test",
      dataIndex: "test",
      key: "test",
      responsive: ['sm'],
      render: (_: any, item: Result) =>
        item.testId ? (
          <div>
            <Text strong>{item.testId.title}</Text>
            <div className="text-xs text-gray-500">
              {item.testId.lessonId.name} ({item.testId.lessonId.day})
            </div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Assignment",
      dataIndex: "assignment",
      key: "assignment",
      responsive: ['md'],
      render: (_: any, item: Result) =>
        item.assignmentId ? (
          <div>
            <Text strong>{item.assignmentId.title}</Text>
            <div className="text-xs text-gray-500">
              {item.assignmentId.lessonId.name} ({item.assignmentId.lessonId.day})
            </div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Scores",
      dataIndex: "scores",
      key: "scores",
      responsive: ['md'],
      render: (_: any, item: Result) => (
        <div>
          <div>Exam: <Text strong>{item.examScore ?? '-'}</Text></div>
          <div>Test: <Text strong>{item.testScore ?? '-'}</Text></div>
          <div>Assignment: <Text strong>{item.assignmentScore ?? '-'}</Text></div>
          <div className="text-green-600 font-semibold mt-1">
            Total: {getTotalScore(item)}
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ['md'],
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, item: Result) => (
        <Space>
          {hasPermission(["admin", "teacher"], role) &&
            <FormModal table="result" type="update" data={item} />}

          {hasPermission(["admin"], role) ? (
            <>



              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="result"
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
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 dark:bg-black text-black dark:text-white transition-all duration-300">
      {/* Top Section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2">
            <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
            <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
            {hasPermission(["admin", "teacher"], role) &&
              <FormModal
                trigger={<button className="btn" ><PlusOutlined /></button>}
                table="result"
                type="create"
                refresh={refresh}
              />
            }
          </div>
        </div>
      </div>

      {/* List Section */}
      <Table
        columns={columns}
        dataSource={paginatedResults}
        rowKey="_id"
        loading={loading}
        pagination={false}
        className="mt-6"
        scroll={{ x: 'max-content' }}
      />

      {/* Pagination Section */}
      <Pagination 
      current={currentPage}
      total={results.length}
      pageSize={pageSize}
      onChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ResultListPage;
