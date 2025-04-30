"use client"

import { useEffect, useState } from "react"
import { Table, Button, Tooltip, Space } from "antd"
import { DeleteOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import { useSnackbar } from "notistack"
import CustomSnackbar from "@/components/CustomSnackbar"
import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import TableSearch from "@/components/TableSearch"
import { getAllEvents } from "@/utils/api"
import { Event } from "@/types/event"
import type { ColumnsType } from "antd/es/table"
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

const EventListPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.role.value);
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const hasPermission = (allowedRoles: UserRole[], currentRole: UserRole) => {
    return allowedRoles.includes(currentRole);
  };
  useRestoreRoleFromToken();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const paginatedEvents = events.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchEvents = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      dispatch(startLoading());
      const response = await getAllEvents(token)
      if (response.data.success) {
        setEvents(response.data.events)
      } else {
        enqueueSnackbar("Failed to fetch events.", {
          variant: "error",
          content: (key) => (
            <CustomSnackbar id={key} message="Failed to fetch events." variant="error" />
          ),
        })
      }
    } catch (error) {
      enqueueSnackbar("Failed to fetch events.", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Failed to fetch events." variant="error" />
        ),
      })
    } finally {
      dispatch(stopLoading());
    }
  }


  useEffect(() => {
    if (mounted) fetchEvents()
  }, [mounted])

  const refresh = fetchEvents

  const columns: ColumnsType<Event> = [
    {
      title: "Event Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["md"],
    },
    {
      title: "Classes",
      dataIndex: "classes",
      key: "classes",
      render: (_, record) => {
        return record.classes && record.classes.length
          ? record.classes.map((cls: any) => cls.name).join(", ")
          : "N/A";
      },
    },

    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (date: string) => (date ? dayjs(date).format("MMM D, YYYY hh:mm A") : "—"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (date: string) => (date ? dayjs(date).format("MMM D, YYYY hh:mm A") : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>

          {hasPermission(["admin", "teacher"], role) &&
            <FormModal table="event" type="update" data={record} refresh={refresh} />}

          {hasPermission(["admin"], role) ? (
            <>

              <Tooltip title="Delete">
                <FormModal
                  trigger={<DeleteOutlined />}
                  table="event"
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
        </Space>
      ),
    },
  ]

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 dark:bg-black text-black dark:text-white transition-all duration-300">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <Button icon={<FilterOutlined />} className="bg-syncOrange border-none text-white" />
            <Button icon={<SortAscendingOutlined />} className="bg-syncOrange border-none text-white" />
            {hasPermission(["admin", "teacher"], role) && (
              <FormModal
                trigger={<button className="btn">Add Event</button>}
                table="event"
                type="create"
                refresh={refresh}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={paginatedEvents}
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
        className="rounded-lg"
      />

      {/* Pagination */}
      <Pagination 
       current={currentPage}
       total={events.length}
       pageSize={pageSize}
       onChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}

export default EventListPage
