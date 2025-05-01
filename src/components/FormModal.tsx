"use client"

import { useState } from "react";
import dynamic from "next/dynamic";
import {
   deleteTeacher, deleteStudent, deleteSubject, deleteClass, deleteLesson, deleteExam,
   deleteAssignment, deleteResult, deleteAttendance, deleteEvent, deleteAnnouncement,
   deleteTest, deleteParent
} from "@/utils/api";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";
import {
   PlusOutlined,
   EditOutlined,
   DeleteOutlined,
} from "@ant-design/icons";
import { Button, Modal, Typography, Popconfirm } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import { Spin } from "antd";

const { Text } = Typography;

// Dynamically import all forms
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const TestForm = dynamic(() => import("./forms/TestForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const ResultForm = dynamic(() => import("./forms/ResultForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
   loading: () => (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
         <Spin size="large" />
      </div>
   ),
});

const forms: {
   [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
   teacher: (type, data) => <TeacherForm type={type} data={data} onSuccess={data?.onSuccess} />,
   student: (type, data) => <StudentForm type={type} data={data} onSuccess={data?.onSuccess} />,
   parent: (type, data) => <ParentForm type={type} data={data} onSuccess={data?.onSuccess} />,
   subject: (type, data) => <SubjectForm type={type} data={data} onSuccess={data?.onSuccess} />,
   class: (type, data) => <ClassForm type={type} data={data} onSuccess={data?.onSuccess} />,
   lesson: (type, data) => <LessonForm type={type} data={data} onSuccess={data?.onSuccess} />,
   exam: (type, data) => <ExamForm type={type} data={data} onSuccess={data?.onSuccess} />,
   assignment: (type, data) => <AssignmentForm type={type} data={data} onSuccess={data?.onSuccess} />,
   test: (type, data) => <TestForm type={type} data={data} onSuccess={data?.onSuccess} />,
   result: (type, data) => <ResultForm type={type} data={data} onSuccess={data?.onSuccess} />,
   attendance: (type, data) => <AttendanceForm type={type} data={data} onSuccess={data?.onSuccess} />,
   event: (type, data) => <EventForm type={type} data={data} onSuccess={data?.onSuccess} />,
   announcement: (type, data) => <AnnouncementForm type={type} data={data} onSuccess={data?.onSuccess} />,
};

const FormModal = ({ table, type, data, id, refresh }: {
   table: keyof typeof forms;
   type: "create" | "update" | "delete";
   data?: any;
   id?: number;
   refresh?: () => void;
}) => {
   const [open, setOpen] = useState(false);
   const { enqueueSnackbar } = useSnackbar();
   const dispatch = useDispatch();
   const isLoading = useSelector((state: RootState) => state.loading.isLoading);


   const deleteFunctions: { [key: string]: (id: string, token?: string) => Promise<any> } = {
      teacher: deleteTeacher,
      student: deleteStudent,
      subject: deleteSubject,
      class: deleteClass,
      lesson: deleteLesson,
      exam: deleteExam,
      assignment: deleteAssignment,
      result: deleteResult,
      attendance: deleteAttendance,
      event: deleteEvent,
      announcement: deleteAnnouncement,
      test: deleteTest,
      parent: deleteParent
   };

   const handleDelete = async () => {
      try {
         dispatch(startLoading()); // 🟠 Start loading
         const token = localStorage.getItem("token");
         const deleteFn = deleteFunctions[table];
         if (!deleteFn || !id) {
            enqueueSnackbar("Delete function not found", {
               variant: "error",
               content: (key) => (
                  <CustomSnackbar id={key} message="Delete function not found" variant="error" />
               ),
            });
            return;
         }

         await deleteFn(id.toString(), token || undefined);

         enqueueSnackbar("Deleted successfully", {
            variant: "success",
            content: (key) => (
               <CustomSnackbar
                  id={key}
                  message={`${table.charAt(0).toUpperCase() + table.slice(1)} deleted successfully`}
                  variant="success"
               />
            ),
         });
         setOpen(false);
         refresh?.();
      } catch (err) {
         console.error("Delete failed", err);
         enqueueSnackbar("Failed to delete", {
            variant: "error",
            content: (key) => (
               <CustomSnackbar id={key} message="Failed to delete" variant="error" />
            ),
         });
      } finally {
         dispatch(stopLoading());
      }
   };

   const iconMap: { [key: string]: JSX.Element } = {
      create: <PlusOutlined />,
      update: <EditOutlined />,
      delete: <DeleteOutlined />,
   };

   const renderForm = () => {
      if (type === "delete" && id) {
         return (
            <div className="flex flex-col gap-4">
               <Text type="danger" className="text-center">
                  All data will be lost. Are you sure you want to delete this {table}?
               </Text>
               <Popconfirm
                  title="Confirm delete"
                  onConfirm={handleDelete}
                  okText="Yes, delete"
                  cancelText="Cancel"
               >
                  <Button
                     danger
                     type="primary"
                     className="self-center"
                     loading={isLoading}
                  >
                     Delete <DeleteOutlined />
                  </Button>

               </Popconfirm>
            </div>
         );
      }

      if (type === "create" || type === "update") {
         return forms[table](type, { ...data, onSuccess: refresh });
      }

      return <>Form not found!</>;
   };

   return (
      <>
         <Button
            icon={iconMap[type]}
            shape="circle"
            type="primary"
            style={{
               backgroundColor:
                  type === "create" ? "#ff7a45" :
                     type === "update" ? "#37AFE1" : "red",
               borderColor: "transparent"
            }}
            onClick={() => setOpen(true)}
         />

         <Modal
            open={open}
            title={`${type.charAt(0).toUpperCase() + type.slice(1)} ${table}`}
            onCancel={() => setOpen(false)}
            footer={null}
            width="60%"
            destroyOnClose
            style={{textAlign: 'center', marginTop: "20px"}}
         >
            {renderForm()}
         </Modal>
      </>
   );
};

export default FormModal;
