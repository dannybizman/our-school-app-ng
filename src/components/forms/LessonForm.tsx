"use client";
import { Button, Select, TimePicker, Form } from "antd";
import { useState, useEffect } from "react";
import { createLesson, updateLesson, getAllSubjects, getAllClasses, getAllTeachers } from "@/utils/api";
import { useSnackbar } from 'notistack'; 
import CustomSnackbar from "@/components/CustomSnackbar";
import dayjs from "dayjs";
import InputField from "../InputField";

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

export default function LessonForm({ type, data, onSuccess }: { type: "create" | "update", data?: any, onSuccess?: () => void }) {
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const { enqueueSnackbar } = useSnackbar();


useEffect(() => {
  if (data) {
    form.setFieldsValue({
      ...data,
      startTime: data.startTime ? dayjs(data.startTime) : null,
      endTime: data.endTime ? dayjs(data.endTime) : null,
    });
  } else {
    form.resetFields();
  }
}, [data]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [subjectsRes, classesRes, teachersRes] = await Promise.all([
          getAllSubjects(token),
          getAllClasses(token),
          getAllTeachers(token),
        ]);

        setSubjects(subjectsRes.data.subjects);
        setClasses(classesRes);
        setTeachers(teachersRes.data.teachers);
      } catch (error: any) {
        console.error("Lesson creation error:", error);
        enqueueSnackbar(error.message || "Error fetching data", {
          variant: "error",
          content: (key, message) => (
            <CustomSnackbar id={key} message={String(message)} variant="error" />
          ),
        });
      }
    };

    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const { subjectId, classId, teacherId, startTime, endTime, ...rest } = values;
  
    if (!subjectId || !classId || !teacherId) {
      enqueueSnackbar("Please select a subject, class, and teacher.", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Please select a subject, class, and teacher." variant="error" />
        ),
      });
      return;
    }
  
    try {
      if (type === "create") {
        await createLesson(
          {
            ...rest,
            subjectId,
            classId,
            teacherId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
          token
        );
  
        enqueueSnackbar("Lesson created successfully!", {
          variant: "success",
          content: (key, message) => (
            <CustomSnackbar id={key} message={String(message)} variant="success" />
          ),
        });
  
        form.resetFields();
      } else if (type === "update" && data?._id) {
        await updateLesson(
          data._id,
          {
            ...rest,
            subjectId,
            classId,
            teacherId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
          token
        );
  
        enqueueSnackbar("Lesson updated successfully!", {
          variant: "success",
          content: (key, message) => (
            <CustomSnackbar id={key} message={String(message)} variant="success" />
          ),
        });
  
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error("Lesson form error:", error);
  
      const message =
        error?.response?.data?.message ||
        error?.message ||
        (type === "update" ? "Error updating lesson." : "Error creating lesson.");
  
      enqueueSnackbar(message, {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message={message} variant="error" />
        ),
      });
    }
  };
  
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow"
    >
      <Form.Item
        label="Lesson Name"
        name="name"
        rules={[{ required: true, message: "Lesson name is required" }]}
      >
        <InputField />
      </Form.Item>

      <Form.Item
        label="Select Day"
        name="day"
        rules={[{ required: true, message: "Please select a day" }]}
      >
        <Select
          placeholder="Select Day"
          options={days.map(day => ({ label: day, value: day }))}
        />
      </Form.Item>

      <Form.Item
        label="Start Time"
        name="startTime"
        rules={[{ required: true, message: "Start time is required" }]}
      >
        <TimePicker style={{ width: "100%" }} placeholder="Start Time" />
      </Form.Item>

      <Form.Item
        label="End Time"
        name="endTime"
        rules={[{ required: true, message: "End time is required" }]}
      >
        <TimePicker style={{ width: "100%" }} placeholder="End Time" />
      </Form.Item>

      <Form.Item
        label="Select Subject"
        name="subjectId"
        rules={[{ required: true, message: "Please select a subject" }]}
      >
        <Select
          placeholder="Select Subject"
          options={subjects.map(subj => ({ label: subj.name, value: subj._id }))}
        />
      </Form.Item>

      <Form.Item
        label="Select Class"
        name="classId"
        rules={[{ required: true, message: "Please select a class" }]}
      >
        <Select
          placeholder="Select Class"
          options={classes.map(cls => ({ label: cls.name, value: cls._id }))}
        />
      </Form.Item>

      <Form.Item
        label="Select Teacher"
        name="teacherId"
        rules={[{ required: true, message: "Please select a teacher" }]}
      >
        <Select
          placeholder="Select Teacher"
          options={teachers.map(teacher => ({ label: `${teacher.firstName} ${teacher.lastName}`, value: teacher._id }))}
        />
      </Form.Item>

      <div className="col-span-1 md:col-span-2 text-right mt-4">
    <Button htmlType="submit" type="primary">
  {type === "create" ? "Create Lesson" : "Update Lesson"}
</Button>

      </div>
    </Form>
  );
}
