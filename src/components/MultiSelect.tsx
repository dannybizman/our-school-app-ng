"use client";
import { Select, Typography } from "antd";
const { Option } = Select;

interface MultiSelectProps {
  label: string;
  options: { _id: string; name: string }[];
  selected: string[];
  setSelected: (value: string[]) => void;
}

export default function MultiSelect({
  label,
  options,
  selected,
  setSelected,
}: MultiSelectProps) {
  return (
    <div className="w-full">
      <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
        {label}
      </Typography.Text>
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%", marginTop: 4 }}
        placeholder={`Select ${label}`}
        value={selected}
        onChange={(values) => {
          // console.log("Selected values:", values);  // Add console log here
          setSelected(values);
        }}
        optionLabelProp="label"
        dropdownStyle={{
          color: "black !important", // Force black color
          backgroundColor: "white", // Optional background color
        }}
      >
       {Array.isArray(options) &&
  options.map((option) => {
    // console.log(option); // Check if options are coming correctly
    return (
      <Option key={option._id} value={option._id} label={option.name} style={{ color: "black" }}>
        {option.name}
      </Option>
    );
  })}

      </Select>
    </div>
  );
}
