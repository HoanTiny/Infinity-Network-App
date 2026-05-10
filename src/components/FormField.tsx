/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

type FormFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  Component: React.ComponentType<any>;
  type: string;
  className: string;
  placeholder: string;
  error?: any;
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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-600 dark:text-gray-400"
        >
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value = '', name } }) => {
          return (
            <Component
              onChange={onChange}
              value={value || ''}
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
      <AnimatePresence mode="wait">
        {error?.message && (
          <motion.p
            key={`${name}-error`}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-red-500 dark:text-red-400 font-medium overflow-hidden"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FormField;
