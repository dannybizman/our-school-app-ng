"use client";

import { useEffect } from "react";
import { Form, Button } from "antd";
import InputField from "../InputField";
import { createSubject, updateSubject } from "@/utils/api";
import { Subject } from "@/types/subject";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";

const SubjectForm = ({
  type,
  data,
  onSuccess,
}: {
  type: "create" | "update";
  data?: Subject;
  onSuccess?: () => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form] = Form.useForm();

  useEffect(() => {
    if (type === "update" && data) {
      form.setFieldsValue({
        name: data.name,
      });
    }
  }, [type, data, form]);

  const handleFinish = async (values: { name: string }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (type === "create") {
        await createSubject({ name: values.name }, token);
        enqueueSnackbar("Subject created successfully!", {
          variant: "success",
          content: (key, message) => (
            <CustomSnackbar id={key} message={String(message)} variant="success" />
          ),
        });
      } else {
        await updateSubject(data!._id, { name: values.name }, token);
        enqueueSnackbar("Subject updated successfully!", {
          variant: "success",
          content: (key, message) => (
            <CustomSnackbar id={key} message={String(message)} variant="success" />
          ),
        });
      }

      if (onSuccess) onSuccess();
      form.resetFields();
    } catch (err) {
      console.error("Subject submission failed", err);
      enqueueSnackbar("Failed to submit subject.", {
        variant: "error",
        content: (key, message) => (
          <CustomSnackbar id={key} message={String(message)} variant="error" />
        ),
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="flex flex-col gap-8 w-auto items-center"
    >


      <Form.Item
        label="Subject Name"
        className="w-[50%]"
        name="name"
        rules={[{ required: true, message: "Please enter the subject name" }]}
      >
        <InputField />
      </Form.Item>

      <Button type="primary" htmlType="submit" className="w-[50%]">
        {type === "create" ? "Create" : "Update"}
      </Button>
    </Form>
  );
};

export default SubjectForm;
