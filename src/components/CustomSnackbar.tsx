import React, { forwardRef } from "react";
import { SnackbarKey, closeSnackbar } from "notistack";
import {
  CheckCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

type Props = {
  id: SnackbarKey;
  message: string;
  variant: "success" | "error" | "info" | "warning";
};

const icons = {
  success: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 16 }} />,
  error: <WarningOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />,
  warning: <ExclamationCircleOutlined style={{ color: "#faad14", fontSize: 16 }} />,
  info: <InfoCircleOutlined style={{ color: "#1890ff", fontSize: 16 }} />,
};

const CustomSnackbar = forwardRef<HTMLDivElement, Props>(
  ({ id, message, variant }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "#141414",
          color: "white",
          padding: "8px 12px",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          fontSize: 14,
          minWidth: 250,
        }}
      >
        {/* Icon */}
        <span style={{ marginRight: 10 }}>{icons[variant]}</span>

        {/* Message */}
        <span style={{ flex: 1 }}>{message}</span>

        {/* Dismiss Button */}
        <button
          style={{
            background: "transparent",
            color: "white",
            border: "none",
            marginLeft: 8,
            cursor: "pointer",
          }}
          onClick={() => closeSnackbar(id)}
        >
          <CloseOutlined />
        </button>
      </div>
    );
  }
);

export default CustomSnackbar;
