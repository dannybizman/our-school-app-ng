
"use client"
import { Form, Input, Select, DatePicker, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";
import AuthInputField from "@/components/AuthInputField";
import { registerAdmin } from "@/utils/api";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";

const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "avatar") {
          const fileArray = value as any[];
          if (fileArray && fileArray.length > 0) {
            const file = fileArray[0].originFileObj;
            if (file) {
              formData.append("avatar", file);
            }
          }
        } else if (key === "birthday") {
          formData.append("birthday", (value as dayjs.Dayjs).format("YYYY-MM-DD"));
        } else {
          formData.append(key, value as string);
        }
      });
      await registerAdmin(formData);
      enqueueSnackbar("Registration successful! Redirecting...", {
        variant: "success",
        content: (key, message) => (
          <CustomSnackbar id={key} message={String(message)} variant="success" />
        ),
      });
      router.push("/login");
      form.resetFields();
      setAvatarPreview(null);
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || err.message || "Registration failed!", {
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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full mx-auto h-10 w-auto" />
        </Link>
        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Register as school admin
        </h2>
        <p className="mt-1 text-center text-sm font-bold text-gray-900 dark:text-white">Please note only school owners can register as school admin.</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center sm:mx-auto mt-12">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6 w-full max-w-2xl"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input className="p-2 text-sm rounded-md" />
            </Form.Item> */}

            <AuthInputField label="Username" name="username" />

            <AuthInputField label="First Name" name="firstName" />

            <AuthInputField label="Last Name" name="lastName" />

            <AuthInputField label="Email" name="email" type="email" />

            <AuthInputField label="Password" name="password" type="password" />

            <AuthInputField label="Phone Number" name="phoneNumber" />

            <AuthInputField label="Address" name="address" />

            <Form.Item name="sex" label="Sex" rules={[{ required: true }]}>
              <Select className="text-sm">
                <Option value="">Select</Option>
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
              </Select>
            </Form.Item>

            <AuthInputField label="Blood Type" name="bloodType" />

            <Form.Item name="birthday" label="Birthday" rules={[{ required: true }]}>
              <DatePicker className="w-full text-sm p-2 rounded-md" />
            </Form.Item>
          </div>
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


          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-syncSky hover:bg-syncPurpleLight hover:text-black dark:hover:text-white"
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <p className="mt-10 text-center text-sm text-black dark:text-white">
          Already an admin?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-syncSky dark:hover:text-syncPurple">
            Manage School Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
