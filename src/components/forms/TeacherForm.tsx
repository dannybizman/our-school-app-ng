"use client";

import { useEffect, useState } from "react";

import {
  createTeacher,
  getAllSubjects,
} from "@/utils/api";
import { Subject } from "@/types/subject";
import AuthInputField from "../AuthInputField";
import MultiSelect from "../MultiSelect";
import { Button, DatePicker, Form, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";

const { Option } = Select;


const TeacherForm = ({ type }: { type: "create" | "update" }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [subjectsRes,] = await Promise.all([
          getAllSubjects(token),
        ]);

        setSubjects(subjectsRes.data?.subjects ?? []);
      } catch (err) {
        console.error("Dropdown fetch error", err);
      }
    };

    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("role", "teacher");

      Object.entries(values).forEach(([key, value]) => {
        if (key === "avatar") {
          const fileArray = value as any[];
          if (fileArray && fileArray.length > 0) {
            const file = fileArray[0].originFileObj;
            if (file) {
              formData.append("avatar", file);
            }
          }
        } else {
          formData.append(key, value as string);
        }
      });

      selectedSubjects.forEach((id) => formData.append("subjects", id));

      const token = localStorage.getItem("token");
      if (!token) return;


      await createTeacher(formData, token);
      enqueueSnackbar("Teacher created successfully!", {
        variant: "success",
        content: (key, message) => (
          <CustomSnackbar id={key} message={String(message)} variant="success" />
        ),
      });

      // RESET FORM FIELDS & STATES
      form.resetFields();
      setSelectedSubjects([]);
      setAvatarPreview(null);

    } catch (err: any) {
      enqueueSnackbar("Failed to create a teacher account!", {
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
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="space-y-8"
    >
      {/* <h1 className="text-xl font-semibold">
        {type === "create" ? "Create" : "Update"} Teacher
      </h1> */}

      {/* Authentication Info */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 mb-2">
          Authentication Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AuthInputField label="Username" name="username" />
          <AuthInputField label="Email" name="email" type="email" />
          <AuthInputField label="Password" name="password" type="password" />
        </div>
      </div>

      {/* Personal Info */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 mb-2">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AuthInputField label="First Name" name="firstName" />
          <AuthInputField label="Last Name" name="lastName" />
          <AuthInputField label="Phone Number" name="phoneNumber" />
          <AuthInputField label="Address" name="address" />
          <AuthInputField label="Blood Type" name="bloodType" />
          <Form.Item name="birthday" label="Birthday">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="sex" label="Sex">
            <Select placeholder="Select Gender">
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
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
      </div>

      {/* Multi Select Fields */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 mb-2">School Info</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <MultiSelect
            label="Subjects"
            options={subjects}
            selected={selectedSubjects}
            setSelected={setSelectedSubjects}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="primary"
          htmlType="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-6 py-2 rounded-md"
          loading={loading}
        >
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </Form>
  );
};

export default TeacherForm;
