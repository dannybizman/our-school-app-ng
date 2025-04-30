"use client";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const TableSearch = () => {
  return (
    <div className="mt-2">
      <div className="w-full md:w-auto flex items-center gap-2">
        <Input
          placeholder="Search..."
          className="w-[200px] rounded-full border border-gray-300 px-3 py-2 text-xs"
          prefix={<SearchOutlined style={{ fontSize: 14, color: "#999" }} />}
          style={{ background: "transparent" }}
        />
      </div>
    </div>
  );
};

export default TableSearch;
