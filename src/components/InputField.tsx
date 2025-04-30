import { Input } from "antd";
import { useState } from "react";
import Image from "next/image";

type InputFieldProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  type?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({ label, type = "text", value, onChange, inputProps }: InputFieldProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      if (onChange) onChange(event);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs text-gray-500">{label}</label>}

      {type === "file" ? (
        <div className="relative w-16 h-16">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="avatarUpload"
          />
          <label htmlFor="avatarUpload" className="cursor-pointer">
            {preview ? (
              <Image src={preview} alt="Preview" width={60} height={60} className="rounded-full border shadow-md" />
            ) : (
              <Image src="/upload.png" alt="Upload Avatar" width={60} height={60} className="rounded-full border shadow-md" />
            )}
          </label>
        </div>
      ) : (
        <Input type={type} value={value} onChange={onChange} {...inputProps} />
      )}
    </div>
  );
};

export default InputField;
