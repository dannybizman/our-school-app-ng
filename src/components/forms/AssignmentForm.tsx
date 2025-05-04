import { Button, DatePicker, Form, Select, Spin, Typography } from "antd";
import { Assignment } from "@/types/assignment";
import InputField from "@/components/InputField";
import { createAssignment, getAllLessons, updateAssignment } from "@/utils/api";
import { useSnackbar } from "notistack";
import CustomSnackbar from "@/components/CustomSnackbar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { Option } = Select;

export default function AssignmentForm({
  type,
  data,
  onSuccess,
}: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [form] = Form.useForm();
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);

  useEffect(() => {
    if (type === "update" && data) {
      form.setFieldsValue({
        title: data.title,
      });
      setSelectedLesson(data.lessonId || null);
      setStartDate(dayjs(data.startDate));
      setEndDate(dayjs(data.endDate));
    }
  }, [type, data, form]);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoadingLessons(true);
      try {
        const token = localStorage.getItem("token");
        const lessonsRes = await getAllLessons(token);
        setLessons(Array.isArray(lessonsRes.lessons) ? lessonsRes.lessons : []);
      } catch (error) {
        enqueueSnackbar("Failed to load lessons", {
          variant: "error",
          content: (key) => (
            <CustomSnackbar
              id={key}
              message="Failed to load lessons"
              variant="error"
            />
          ),
        });
      } finally {
        setLoadingLessons(false);
      }
    };

    fetchLessons();
  }, [enqueueSnackbar]);




  const onFinish = async (values: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!selectedLesson || !startDate || !endDate) {
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
        await createAssignment({
          ...values,
          startDate: dayjs(startDate).toISOString(),
          endDate: dayjs(endDate).toISOString(),
          lessonId: selectedLesson,
        }, token);
        enqueueSnackbar("Assignment created successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar
              id={key}
              message="Assignment created successfully!"
              variant="success"
            />
          ),
        });
        form.resetFields();
        setSelectedLesson(null);
        setStartDate(null);
        setEndDate(null);
        if (onSuccess) onSuccess();
      }
      if (type === "update" && data?._id) {
        await updateAssignment(data._id, {
          ...values,
          startDate: dayjs(startDate).toISOString(),
          endDate: dayjs(endDate).toISOString(),
          lessonId: selectedLesson,
        }, token);
        enqueueSnackbar("Assignment updated successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar
              id={key}
              message="Assignment updated successfully!"
              variant="success"
            />
          ),
        });
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Something went wrong";
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
       <div className="flex flex-col gap-2 w-full md:w-1/4">
       <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter a title" }]}
        className="w-full md:w-1/4"
      >
        <InputField />
      </Form.Item>
       </div>
     

      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="block mb-1 text-sm font-medium">Start Time</label>
        <DatePicker
          showTime
          style={{ width: "100%" }}
          value={startDate}
          onChange={(val) => setStartDate(val)}
        />
      </div>

      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="block mb-1 text-sm font-medium">End Time</label>
        <DatePicker
          showTime
          style={{ width: "100%" }}
          value={endDate}
          onChange={(val) => setEndDate(val)}
        />
      </div>

      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
          Select Lesson
        </Typography.Text>
        {loadingLessons ? (
          <Spin size="small" />
        ) : (
          <Select
            placeholder="Select Lesson"
            style={{ width: "100%" }}
            value={selectedLesson || undefined}
            onChange={(val) => setSelectedLesson(val)}
          >
            {lessons.map((lesson) => (
              <Option key={lesson._id} value={lesson._id}>
                {lesson.name}
              </Option>
            ))}
          </Select>
        )}
      </div>

      <Form.Item className="w-full">
        <Button htmlType="submit" type="primary">
          {type === "create" ? "Create Assignment" : "Update Assignment"}
        </Button>
      </Form.Item>
    </Form>
  );
}
