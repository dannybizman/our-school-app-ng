"use client";
import { Button, DatePicker, Form, Switch, Select } from "antd";
import { createAttendance, getAllStudents, getAllLessons, updateAttendance } from "@/utils/api";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import { Student } from "@/types/student";
import { Lesson } from "@/types/lesson";
import dayjs from "dayjs";

export default function AttendanceForm({
  type,
  data,
  onSuccess,
}: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}) {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (type === "update" && data) {
      form.setFieldsValue({
        date: data.date ? dayjs(data.date) : null,
        present: data.present,
        studentId: data.studentId,
        lessonId: data.lessonId,
      });
    }
  }, [type, data, form]);
  
  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const studentsData = await getAllStudents(token);
      setStudents(studentsData);
    };
    fetchStudents();
  }, []);


  
  const fetchLessons = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const lessonsData = await getAllLessons(token);
    setLessons(lessonsData.lessons); 
  };
    useEffect(() => {
      fetchLessons();
    }, []);


    const onFinish = async (values: any) => {
      const token = localStorage.getItem("token");
      if (!token) return;
    
      try {
        const payload = {
          ...values,
          date: values.date ? values.date.toISOString() : null,
        };
    
        let response;
        if (type === "create") {
          response = await createAttendance(payload, token);
        } else {
          response = await updateAttendance(data._id, payload, token);
        }
    
        if (response?.data?.success) {
          enqueueSnackbar(
            type === "create"
              ? "Attendance marked successfully!"
              : "Attendance updated successfully!",
            {
              variant: "success",
              content: (key) => (
                <CustomSnackbar
                  id={key}
                  message={
                    type === "create"
                      ? "Attendance marked successfully!"
                      : "Attendance updated successfully!"
                  }
                  variant="success"
                />
              ),
            }
          );
          form.resetFields();
          onSuccess?.(); // call the callback if provided
        }
      } catch (error: any) {
        const errorMsg =
          error?.data?.message || "Something went wrong while saving attendance";
        enqueueSnackbar(errorMsg, {
          variant: "error",
          content: (key) => (
            <CustomSnackbar
              id={key}
              message={
                type === "create"
                  ? "Failed to mark attendance."
                  : "Failed to update attendance."
              }
              variant="error"
            />
          ),
        });
      }
    };
    

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="flex flex-wrap gap-4"
    >
       <div className="flex flex-col gap-2 w-full md:w-1/4">
       <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
       </div>
   
       <div className="flex flex-col gap-2 w-full md:w-1/4">
      <Form.Item
        label="Present"
        name="present"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-1/4">
      <Form.Item label="Student" name="studentId" rules={[{ required: true, message: 'Please select a student' }]}>
        <Select
          showSearch
          placeholder="Select a Student"
          optionFilterProp="children"
          allowClear
        >
          {students.map((student) => (
            <Select.Option key={student._id} value={student._id}>
              {student.firstName} {student.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-1/4">
      <Form.Item label="Lesson" name="lessonId" rules={[{ required: true, message: 'Please select a lesson' }]}>
        <Select
          showSearch
          placeholder="Select a Lesson"
          optionFilterProp="children"
          allowClear
        >
          {lessons.map((lesson) => (
            <Select.Option key={lesson._id} value={lesson._id}>
              {lesson.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      </div>
      
      <Form.Item className="w-full">
        <Button htmlType="submit" type="primary">
        {type === "create" ? "Create Attendance" : "Update Attendance"}
        </Button>
      </Form.Item>

    </Form>
  );
}
