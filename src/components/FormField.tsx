/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';

type FormFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  Component: React.ComponentType<any>;
  type: string;
  className: string;
  placeholder: string;
  error?: FieldError; // Cập nhật kiểu tại đây
};

function FormField({
  name,
  control,
  label,
  Component,
  type,
  className,
  placeholder,
  error,
}: FormFieldProps) {
  return (
    <div>
      <h3 className="">{label}</h3>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value = '', name } }) => {
          return (
            <Component
              onChange={onChange}
              value={value || ''} // Đảm bảo giá trị không phải undefined
              name={name}
              control={control}
              type={type}
              className={className}
              placeholder={placeholder}
              error={error?.message}
            />
          );
        }}
      />
      {error?.message && <span className="text-red-500">{error.message}</span>}
    </div>
  );
}

export default FormField;
