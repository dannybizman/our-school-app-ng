"use client";

import { useEffect, useState } from "react";
import { Table, Button, Input, Space, Tooltip } from "antd";
import { DeleteOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import { getAllClasses } from "@/utils/api";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import Image from "next/image";
import type { ColumnsType } from "antd/es/table";
import TableSearch from "@/components/TableSearch";
import { Class } from '@/types/class';
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";


const ClassListPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false)
  const role = useSelector((state: RootState) => state.role.value);
  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };
  useRestoreRoleFromToken();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const paginatedClasses = classes.slice((currentPage - 1) * pageSize, currentPage * pageSize);



  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchClasses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      dispatch(startLoading());
      const data = await getAllClasses(token);
      setClasses(data);
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

  useEffect(() => {
    if (mounted) fetchClasses()
  }, [mounted])



  const refresh = fetchClasses;

  const columns: ColumnsType<Class> = [
    {
      title: "Class Name",
      dataIndex: "name",
      key: "name",
      // responsive: ["sm", "md"],
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      responsive: ["md"],
    },
    {
      title: "Grade",
      dataIndex: "gradeLevel",
      key: "gradeLevel",
      // responsive: ["md"],
      render: (gradeLevel) => gradeLevel || "N/A",
    },
    {
      title: "Supervisor",
      key: "supervisorId",
      responsive: ["sm", "md"],
      render: (_, record) => {
        const supervisor = record.supervisorId;
        return (
          <Space>
            <Image
              src={supervisor?.avatar?.url || "/default-avatar.png"}
              alt="Supervisor Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <strong>{supervisor?.firstName || "N/A"} {supervisor?.lastName || ""}</strong>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {hasPermission(["admin", "teacher"], role) &&
            <FormModal table="class" type="update" data={record} refresh={refresh} />}

          {hasPermission(["admin"], role) ? (
            <>
              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="class"
                  type="delete"
                  id={record._id}
                  refresh={fetchClasses}
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold hidden md:block">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3">
            <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
            <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
            {hasPermission(["admin", "teacher"], role) && <FormModal
              trigger={<button className="btn">Add Class</button>}
              table="class"
              type="create"
              refresh={fetchClasses}
            />}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={paginatedClasses}
          rowKey="_id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={false}
        />
      </div>


      <div className="mt-4">
        <Pagination
          current={currentPage}
          total={classes.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default ClassListPage;
