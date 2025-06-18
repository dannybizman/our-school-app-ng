"use client";
import { useEffect, useState } from "react";
import { createStudent, getAllClasses } from "@/utils/api";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";
import { Class } from "@/types/class";
import { Button, DatePicker, Form, Select, Upload } from "antd";
import AuthInputField from "../AuthInputField";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const StudentForm = ({ type }: { type: "create" | "update" }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const [classesRes] = await Promise.all([getAllClasses(token)]);
        setClasses(classesRes);
      } catch (error: any) {
        console.error("Student creation error:", error);
        enqueueSnackbar(error.message || "Error fetching classes", {
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
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("role", "student");

      // Append avatar file
      const fileArray = values.avatar;
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0].originFileObj;
        if (file) {
          formData.append("avatar", file);
        }
      }

      // Append other fields
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "avatar") {
          formData.append(key, value as string);
        }
      });

      // Append selected class
      if (selectedClass) {
        formData.append("classId", selectedClass);
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      await createStudent(formData, token);

      enqueueSnackbar("Student created successfully!", {
        variant: "success",
        content: (key, message) => (
          <CustomSnackbar id={key} message={String(message)} variant="success" />
        ),
      });

      form.resetFields();
      setSelectedClass(null);
      setAvatarPreview(null);
    } catch (err: any) {
      enqueueSnackbar("Failed to create student account", {
        variant: "error",
        content: (key, message) => (
          <CustomSnackbar id={key} message={String(message)} variant="error" />
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-8">
      {/* <h1 className="text-xl font-semibold">{type === "create" ? "Create" : "Update"} Student</h1> */}

      <span className="text-xs font-medium text-gray-400">Authentication Information</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AuthInputField label="Username" name="username" />
        <AuthInputField label="Password" name="password" type="password" />
      </div>

      <span className="text-xs font-medium text-gray-400">Personal Information</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AuthInputField label="First Name" name="firstName" />
        <AuthInputField label="Last Name" name="lastName" />
        <AuthInputField label="Address" name="address" />
        <AuthInputField label="Blood Type" name="bloodType" />
        <Form.Item name="birthday" label="Birthday">
            <DatePicker className="w-full" />
          </Form.Item>
        <Form.Item
          name="sex"
          label={<span className="text-xs text-gray-500">Gender</span>}
          rules={[{ required: true, message: "Gender is required." }]}
        >
          <Select placeholder="Select Gender">
            <Option value="MALE">Male</Option>
            <Option value="FEMALE">Female</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Class"
          name="class"
        >
          <Select
            placeholder="Select Class"
            value={selectedClass}
            onChange={(value) => setSelectedClass(value)}
          >
            {classes.map((cls) => (
              <Option key={cls._id} value={cls._id}>{cls.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Avatar"
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.fileList || [];
          }}
          rules={[{ required: true, message: "Please upload an avatar!" }]}
        >
          <Upload
            beforeUpload={() => false}
            listType="picture"
            maxCount={1}
            accept="image/*"
            showUploadList={false}
            onChange={(info) => {
              const fileList = info.fileList;
              const latestFile = fileList[fileList.length - 1];
              const file = latestFile?.originFileObj;

              if (file && file.type.startsWith("image/")) {
                const previewUrl = URL.createObjectURL(file);
                setAvatarPreview(previewUrl);
              }

              form.setFieldsValue({ avatar: fileList });
            }}
            fileList={form.getFieldValue("avatar") || []}
          >
            <div className="flex items-center gap-4 cursor-pointer">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-full border shadow-md object-cover"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center rounded-full border shadow-md bg-gray-100 text-gray-400">
                  <UploadOutlined className="text-xl" />
                </div>
              )}
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </div>
          </Upload>
        </Form.Item>

      </div>

      <Button htmlType="submit" type="primary" loading={loading}>
        {type === "create" ? "Create Student" : "Update Student"}
      </Button>
    </Form>
  );
};

export default StudentForm;
