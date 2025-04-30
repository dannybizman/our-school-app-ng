"use client";

import { Modal, Card } from "antd";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
};

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Teacher", value: "teacher" },
  { label: "Parent", value: "parent" },
  { label: "Student", value: "student" },
];

const LoginSelectorModal = ({ open, onClose }: Props) => {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    onClose();
    router.push(`/login?role=${role}`);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="rounded-lg"
    >
      <h2 className="text-xl font-semibold text-center mb-6">Select Login Type</h2>
      <div className="grid grid-cols-2 gap-4">
        {roles.map((r) => (
          <Card
            key={r.value}
            hoverable
            onClick={() => handleRoleSelect(r.value)}
            className="cursor-pointer shadow-sm border border-gray-200 rounded-lg transition-all duration-300 hover:border-blue-500"
          >
            <p className="text-center text-lg font-medium">{r.label}</p>
          </Card>
        ))}
      </div>
    </Modal>
  );
};

export default LoginSelectorModal;
