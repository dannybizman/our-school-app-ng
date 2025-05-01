"use client";

import { useEffect, useState } from "react";
import { Table, Button, Tooltip } from "antd";
import { DeleteOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { getAllSubjects } from "@/utils/api";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import { Subject } from "@/types/subject";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { UserRole } from "@/constants/roles";


const SubjectListPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const role = useSelector((state: RootState) => state.role.value);
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch();
  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };
  useRestoreRoleFromToken();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const paginatedSubjects = subjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  useEffect(() => {
    setMounted(true)
  }, [])


  const fetchSubjects = async () => {
    try {
      dispatch(startLoading());
      const token = localStorage.getItem("token");
      const res = await getAllSubjects(token);
      setSubjects(res.data?.subjects || []);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to fetch subjects", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Failed to fetch subjects" variant="error" />
        ),
      });
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    if (mounted) fetchSubjects()
  }, [mounted])

  const refresh = fetchSubjects;

  const columns = [
    {
      title: "Subject Name",
      dataIndex: "name",
      key: "name",
      // responsive: ["sm", "md"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Subject) => (
        <div className="flex items-center gap-2">
          {hasPermission(["admin", "teacher"], role) &&
            <FormModal table="subject" type="update" data={record} refresh={refresh} />}


          {hasPermission(["admin"], role) ? (
            <>

              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="subject"
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
      // responsive: ["sm", "md"],
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 dark:bg-black text-black dark:text-white transition-all duration-300">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2">
            <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
            <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
            {hasPermission(["admin", "teacher"], role) && <FormModal
              trigger={<button className="btn">Add Subject</button>}
              table="subject"
              type="create"
              refresh={fetchSubjects}
            />}
          </div>
        </div>
      </div>


      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={paginatedSubjects}
          loading={loading}
          pagination={false}
          rowKey="_id"
          scroll={{ x: "max-content" }}
        />
      </div>

      <div className="mt-4">
        <Pagination
          current={currentPage}
          total={subjects.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default SubjectListPage;
