import { Button, DatePicker, Form, Select, Spin, Typography } from "antd";
import { Test } from "@/types/test";
import InputField from "@/components/InputField";
import { createTest, getAllLessons, updateTest } from "@/utils/api";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Lesson } from "@/types/lesson";

const { Option } = Select;

export default function TestForm({
  type,
  data,
  onSuccess,
}: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}) {
  const [form] = Form.useForm<Test>();
  const { enqueueSnackbar } = useSnackbar();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    if (type === "update" && data) {
      form.setFieldsValue({
        title: data.title,
        lessonId: data.lessonId,
        startDate: dayjs(data.startDate),
        endDate: dayjs(data.endDate),
      });
    }
  }, [type, data, form]);


  useEffect(() => {
    const fetchLessons = async () => {
      const token = localStorage.getItem("token");
      setLoadingLessons(true);
      try {
        const lessonsRes = await getAllLessons(token);
        setLessons(Array.isArray(lessonsRes.lessons) ? lessonsRes.lessons : []);
      } catch (error) {
        enqueueSnackbar("Failed to load lessons", {
          variant: "error",
          content: (key) => (
            <CustomSnackbar id={key} message="Failed to load lessons" variant="error" />
          ),
        });
      } finally {
        setLoadingLessons(false);
      }
    };

    fetchLessons();
  }, []);
  const onFinish = async (values: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!values.lessonId || !values.startDate || !values.endDate) {
      enqueueSnackbar("Please fill in all required fields", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Please fill in all required fields" variant="error" />
        ),
      });
      return;
    }

    const testData = {
      ...values,
      startDate: dayjs(values.startDate).toISOString(),
      endDate: dayjs(values.endDate).toISOString(),
    };

    try {
      if (type === "create") {
        await createTest({
          ...values,
          startDate: dayjs(values.startDate).toISOString(),
          endDate: dayjs(values.endDate).toISOString(),
        }, token);
        enqueueSnackbar("Test created successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar id={key} message="Test created successfully!" variant="success" />
          ),
        });
        form.resetFields();
      } else if (type === "update" && data?._id) {
        await updateTest(data._id, {
          ...values,
          startDate: dayjs(values.startDate).toISOString(),
          endDate: dayjs(values.endDate).toISOString(),
        }, token);
        enqueueSnackbar("Test updated successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar id={key} message="Test updated successfully!" variant="success" />
          ),
        });
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      enqueueSnackbar(errorMsg, {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message={errorMsg} variant="error" />
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
      {/* Test Title */}
      <Form.Item
        label="Test Title"
        name="title"
        rules={[{ required: true, message: "Please enter test title" }]}
        className="w-full md:w-1/4"
      >
        <InputField />
      </Form.Item>

      {/* Start Date */}
      <Form.Item
        label="Start Time"
        name="startDate"
        rules={[{ required: true, message: "Please select start time" }]}
        className="w-full md:w-1/4"
      >
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      {/* End Date */}
      <Form.Item
        label="End Time"
        name="endDate"
        rules={[{ required: true, message: "Please select end time" }]}
        className="w-full md:w-1/4"
      >
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      {/* Select Lesson */}
      <Form.Item
        label="Select Lesson"
        name="lessonId"
        rules={[{ required: true, message: "Please select a lesson" }]}
        className="w-full md:w-1/4"
      >
        {loadingLessons ? (
          <Spin size="small" />
        ) : (
          <Select placeholder="Select Lesson" style={{ width: "100%" }}>
            {lessons.map((lesson) => (
              <Option key={lesson._id} value={lesson._id}>
                {lesson.name}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>

      {/* Submit Button */}
      <Form.Item className="w-full">
        <Button htmlType="submit" type="primary">
          {type === "create" ? "Create Test" : "Update Test"}
        </Button>
      </Form.Item>
    </Form>
  );
}
