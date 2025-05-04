"use client";
import { useEffect, useState } from "react";
import { Button, Form } from "antd";
import { Class } from "@/types/class";
import InputField from "@/components/InputField";
import MultiSelect from "@/components/MultiSelect";
import { createClass, getAllTeachers, updateClass } from "@/utils/api";
import { useSnackbar } from 'notistack';
import CustomSnackbar from "@/components/CustomSnackbar";

interface Props {
  supervisorId: string;
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}

export default function ClassForm({ supervisorId, type, data, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>(supervisorId);
  const [teachers, setTeachers] = useState<any[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchTeachers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await getAllTeachers(token);
      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (err) {
      enqueueSnackbar("Failed to fetch teachers", {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message="Failed to fetch teachers" variant="error" />
        ),
      });
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Prefill form when type is 'update'
  useEffect(() => {
    if (type === "update" && data) {
      form.setFieldsValue({
        name: data.name,
        capacity: data.capacity,
        gradeLevel: data.gradeLevel,
      });
      setSelectedSupervisor(data.supervisorId);
    }
  }, [type, data, form]);

  const onFinish = async (values: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const finalData = {
      ...values,
      supervisorId: selectedSupervisor,
    };

    try {
      if (type === "create") {
        await createClass(finalData, token);
        enqueueSnackbar("Class created successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar id={key} message="Class created successfully!" variant="success" />
          ),
        });
        form.resetFields();
        setSelectedSupervisor(supervisorId);
      } else if (type === "update" && data?._id) {
        await updateClass(data._id, finalData, token);
        enqueueSnackbar("Class updated successfully!", {
          variant: "success",
          content: (key) => (
            <CustomSnackbar id={key} message="Class updated successfully!" variant="success" />
          ),
        });
      }

      onSuccess?.();
    } catch (error) {
      enqueueSnackbar(`Failed to ${type} class.`, {
        variant: "error",
        content: (key) => (
          <CustomSnackbar id={key} message={`Failed to ${type} class.`} variant="error" />
        ),
      });
      console.error(error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="flex flex-wrap gap-4"
    >
      <Form.Item
        label="Class Name"
        name="name"
        rules={[{ required: true, message: "Please enter class name" }]}
      >
        <InputField />
      </Form.Item>

      <Form.Item
        label="Capacity"
        name="capacity"
        rules={[{ required: true, message: "Please enter capacity" }]}
      >
        <InputField type="number" />
      </Form.Item>

      <Form.Item
        label="Grade Level"
        name="gradeLevel"
        rules={[{ required: true, message: "Please enter grade level" }]}
      >
        <InputField type="number" />
      </Form.Item>

      <div className="w-full">
        <MultiSelect
          label="Select Supervisor"
          options={teachers.map((teacher) => ({
            _id: teacher._id,
            name: `${teacher.firstName} ${teacher.lastName}`,
          }))}
          selected={selectedSupervisor ? [selectedSupervisor] : []}
          setSelected={(val) => setSelectedSupervisor(val[0])}
        />
      </div>

      <Form.Item>
        <Button htmlType="submit" type="primary">
          {type === "create" ? "Create Class" : "Update Class"}
        </Button>
      </Form.Item>
    </Form>
  );
}
