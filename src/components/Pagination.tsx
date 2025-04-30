"use client";

import { Pagination as AntdPagination } from "antd";

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
}

const Pagination = ({ current, total, pageSize, onChange }: PaginationProps) => {
  return (
    <div className="p-4 flex items-center justify-center">
      <AntdPagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        className="!text-gray-700 dark:!text-white [&_.ant-pagination-item-active]:!bg-syncSkyLight [&_.ant-pagination-item-active]:!border-syncSkyLight [&_.ant-pagination-item]:rounded [&_.ant-pagination-item-link]:rounded"
      />
    </div>
  );
};

export default Pagination;
