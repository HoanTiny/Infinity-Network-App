import { TextField } from '@mui/material';
import { FieldError } from 'react-hook-form';

type TextInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  className: string;
  placeholder: string;
  error?: FieldError; // Cập nhật kiểu tại đây
};

function TextInput({
  name,
  value,
  onChange,
  type = 'text',
  className,
  placeholder,
  error,
}: TextInputProps) {
  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className={className}
      placeholder={placeholder}
      slotProps={{
        input: { className: 'h-10 px-3 py-2' },
        htmlInput: { className: '!p-0' },
      }}
      error={!!error}
    />
  );
}

export default TextInput;
