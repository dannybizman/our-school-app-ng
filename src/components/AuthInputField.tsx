import { Form, Input, Upload } from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";

type AntdFieldProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
};

const AuthInputField = ({
  label,
  name,
  type = "text",
  defaultValue,
}: AntdFieldProps) => {
  
  return (
    <Form.Item
      name={name}
      label={<span className="text-xs text-gray-500">{label}</span>}
      className="w-full"
      rules={[{ required: true, message: `${label} is required.` }]}
    >
      <Input
          type={type}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          defaultValue={defaultValue}
        />
    </Form.Item>
  );
};

export default AuthInputField;
