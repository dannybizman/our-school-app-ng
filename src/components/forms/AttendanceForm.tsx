"use client";
import { Button, DatePicker, Form, Switch, Select } from "antd";
import { createAttendance, getAllStudents, getAllLessons } from "@/utils/api";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import { Student } from "@/types/student";
import { Lesson } from "@/types/lesson";

export default function AttendanceForm() {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);


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
    setLessons(lessonsData.lessons);  // <-- here
  };
    useEffect(() => {
      fetchLessons();
    }, []);


  const onFinish = async (values: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await createAttendance(
        {
          ...values,
          date: values.date ? values.date.toISOString() : null, // convert date to ISO string
        },
        token
      );

      if (response?.data?.success) {
        enqueueSnackbar("Attendance marked successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar id={key} message="Attendance marked successfully!" variant="success" />
          ),
        });
        form.resetFields();
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || "Something went wrong";
      enqueueSnackbar(errorMsg, {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Failed to mark attendance." variant="error" />
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
      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Present"
        name="present"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>


      {/* Student Select */}
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


      {/* Student Select */}
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
      {/* Submit Button */}
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Mark Attendance
        </Button>
      </Form.Item>
    </Form>
  );
}
