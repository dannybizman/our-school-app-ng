"use client";
import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Select, Typography } from "antd";
import { Exam } from "@/types/exam";
import InputField from "@/components/InputField";
import { createExam, getAllSubjects } from "@/utils/api";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";
import dayjs from "dayjs";

const { Option } = Select;

export default function ExamForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [subjectsRes] = await Promise.all([
          getAllSubjects(token),
        ]);

        setSubjects(subjectsRes.data.subjects);
      } catch (error: any) {
        console.error("Exam creation error:", error);
        enqueueSnackbar(error.message || "Error creating Exam", {
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

    if (!selectedSubject) {
      enqueueSnackbar("Please select a subject.", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Please select a subject." variant="error" />
        ),
      });
      return;
    }

    try {
      await createExam(
        {
          ...values,
          subjectId: selectedSubject,
          startTime: dayjs(values.startTime).toISOString(),
          endTime: dayjs(values.endTime).toISOString(),
        },
        token
      );

      enqueueSnackbar("Exam created successfully!", {
        variant: "success",
        content: (key) => (
          <CustomSnackbar id={key} message="Exam created successfully!" variant="success" />
        ),
      });

      form.resetFields();
      setSelectedSubject(null);
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || "Error creating exam";
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
      layout="vertical"
      onFinish={onFinish}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow"
    >
      <Form.Item
        label="Exam Title"
        name="title"
        rules={[{ required: true, message: "Please enter the exam title" }]}
      >
        <InputField />
      </Form.Item>

      <Form.Item
        label="Start Time"
        name="startTime"
        rules={[{ required: true, message: "Please select start time" }]}
      >
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="End Time"
        name="endTime"
        rules={[{ required: true, message: "Please select end time" }]}
      >
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      {/* Multiselect field kept untouched */}
      <div className="col-span-1 md:col-span-2">
        <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
          Select Subject
        </Typography.Text>
        <Select
          placeholder="Select Subject"
          style={{ width: "100%" }}
          value={selectedSubject || undefined}
          onChange={(val) => setSelectedSubject(val)}
          options={subjects.map((subj) => ({ label: subj.name, value: subj._id }))}
        />
      </div>

      <div className="col-span-1 md:col-span-2 text-right mt-4">
        <Button htmlType="submit" type="primary">
          Create Exam
        </Button>
      </div>
    </Form>
  );
}
