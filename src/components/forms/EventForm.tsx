"use client";

import dayjs from "dayjs";
import { Button, DatePicker, Form, TimePicker, } from "antd";
import { Event } from "@/types/event";
import InputField from "@/components/InputField";
import { useSnackbar } from "notistack"
import CustomSnackbar from "@/components/CustomSnackbar"
import { createEvent, getAllClasses, updateEvent } from "@//utils/api";
import { useEffect, useState } from "react";
import MultiSelect from "../MultiSelect";

export default function EventForm({
  type,
  data,
  onSuccess,
}: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}) {
  const [form] = Form.useForm<Event>();
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);


  useEffect(() => {
    if (type === "update" && data) {
      form.setFieldsValue({
        ...data,
        startTime: data.startTime ? dayjs(data.startTime) : null,
        endTime: data.endTime ? dayjs(data.endTime) : null,
      });
      setSelectedClasses(data.classes || []);

    }
  }, [type, data, form]);

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

    const { selectedClasses, startTime, endTime, ...rest } = values;
    if (!selectedClasses || !startTime || !endTime) {
      enqueueSnackbar("Please fill in all required fields", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar
            id={key}
            message="Please fill in all required fields"
            variant="error"
          />
        ),
      });
      return;
    }

    try {
      if (type === "create") {
        await createEvent({
          ...rest,
          classes: selectedClasses,
          startTime: dayjs(values.startTime).toISOString(),
          endTime: dayjs(values.endTime).toISOString(),
        }, token);
        enqueueSnackbar("Event created successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar id={key} message="Event created successfully!" variant="success" />
          ),
        });
        form.resetFields();
        setSelectedClasses([]);
        if (onSuccess) onSuccess();
      } if (type === "update" && data?._id) {
        console.log("Updating event with ID:", data._id);
        await updateEvent(data._id, {
          ...rest,
          classes: selectedClasses,
          startTime: dayjs(startTime).toISOString(),
          endTime: dayjs(endTime).toISOString(),
        }, token);
        enqueueSnackbar("Event updated successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar id={key} message="Event updated successfully!" variant="success" />
          ),
        });
        if (onSuccess) onSuccess();
      }

    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Something went wrong";
      enqueueSnackbar(errorMsg || "Error saving event", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message={errorMsg} variant="error" />
        ),
      });
    }
  };


  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
          <InputField />
        </Form.Item>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description is required" }]}>
          <InputField />
        </Form.Item>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item
          label="Start Time"
          name="startTime"
          rules={[{ required: true, message: "Start time is required" }]}
        >
          <TimePicker style={{ width: "100%" }} placeholder="Start Time" />
        </Form.Item>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Form.Item
          label="End Time"
          name="endTime"
          rules={[{ required: true, message: "End time is required" }]}
        >
          <TimePicker style={{ width: "100%" }} placeholder="End Time" />
        </Form.Item>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <MultiSelect
          label="Classes"
          options={classes}
          selected={selectedClasses}
          setSelected={setSelectedClasses}
        />

      </div>
      <Form.Item className="w-full">
        <Button htmlType="submit" type="primary">
          {type === "create" ? "Create Event" : "Update Event"}
        </Button>
      </Form.Item>

    </Form>

  );
}
