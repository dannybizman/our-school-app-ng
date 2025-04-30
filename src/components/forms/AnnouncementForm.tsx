"use client";
import dayjs from "dayjs";
import { Button, DatePicker, Form, } from "antd";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import MultiSelect from "../MultiSelect";
import { Announcement } from "@/types/announcement";
import InputField from "@/components/InputField";
import { createAnnouncement, getAllClasses } from "@/utils/api";
import { useSnackbar } from "notistack"
import CustomSnackbar from "@/components/CustomSnackbar"

export default function AnnouncementForm() {
  const [form] = Form.useForm<Event>();
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const [classesRes] = await Promise.all([
          getAllClasses(token),
        ]);
        setClasses(classesRes);
      } catch (error: any) {
        console.error("Class creation error:", error);
        enqueueSnackbar(error.message || "Error creating class", {
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

    try {
      await createAnnouncement({
        ...values,
        classes: selectedClasses,
        startTime: dayjs(values.startTime).toISOString(),
        endTime: dayjs(values.endTime).toISOString(),
      }, token);


      enqueueSnackbar("Announcement created successfully!", {
        variant: "success",
        content: (key, message) => (
          <CustomSnackbar id={key} message={String(message)} variant="success" />
        ),
      });

      form.resetFields();
      setSelectedClasses([]);

    } catch (error: any) {
      console.error("Announcement creation error:", error);
      enqueueSnackbar(error.message || "Error creating announcement", {
        variant: "error",
        content: (key, message) => (
          <CustomSnackbar id={key} message={String(message)} variant="error" />
        ),
      });
    }
  };


  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="flex flex-wrap gap-4">
      <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
        <InputField />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description is required" }]}>
        <InputField />
      </Form.Item>
      <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: "Start time is required" }]}>
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="endTime" label="End Time" rules={[{ required: true, message: "End time is required" }]}>
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      <MultiSelect
        label="Classes"
        options={classes}
        selected={selectedClasses}
        setSelected={setSelectedClasses}
      />


      <Button htmlType="submit" type="primary">Create Announcement</Button>
    </Form>
  );
}
