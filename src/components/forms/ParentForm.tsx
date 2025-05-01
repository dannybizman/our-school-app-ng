"use client"
import { useEffect, useState } from "react";
import {
   createParent,
   getAllStudents,
} from "@/utils/api";
import AuthInputField from "../AuthInputField";
import MultiSelect from "../MultiSelect";
import { Button, DatePicker, Form, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";
import { Student } from "@/types/student";

const { Option } = Select;

const ParentForm = ({ type }: { type: "create" | "update" }) => {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const [students, setStudents] = useState<Student[]>([]);
   const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
   const { enqueueSnackbar } = useSnackbar();


   const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
         const data = await getAllStudents(token);
         setStudents(data);
      } catch (err) {
         enqueueSnackbar("Failed to fetch students", {
            variant: "error",
            content: (key) => (
               <CustomSnackbar id={key} message="Failed to fetch students" variant="error" />
            ),
         });
      }
   };

   useEffect(() => {
      fetchStudents();
   }, []);

   const onFinish = async (values: any) => {
      setLoading(true);
      try {
         const formData = new FormData();

         formData.append("role", "parent");

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

         selectedStudents.forEach((id) => formData.append("students", id));

         const token = localStorage.getItem("token");
         if (!token) return;


         await createParent(formData, token);
         enqueueSnackbar("Parent created successfully!", {
            variant: "success",
            content: (key, message) => (
               <CustomSnackbar id={key} message={String(message)} variant="success" />
            ),
         });

         // RESET FORM FIELDS & STATES
         form.resetFields();
         setSelectedStudents([]);
         setAvatarPreview(null);

      } catch (err: any) {
         enqueueSnackbar("Failed to create a parent account!", {
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
         <div className="w-full">
            <MultiSelect
               label="Students"
               options={students.map((student) => ({
                  _id: student._id,
                  name: `${student.firstName} ${student.lastName}`,
                }))}
               selected={selectedStudents}
               setSelected={setSelectedStudents}
            />
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


export default ParentForm;