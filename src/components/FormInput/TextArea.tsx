type TextAreaProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  className?: string;
  placeholder?: string;
  error?: string;
};
export default function TextArea({
  name,
  value,
  onChange,
  className,
  placeholder,
  error,
}: TextAreaProps) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      aria-invalid={!!error}
      className={`w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      placeholder={placeholder}
      rows={4}
      cols={50}
      style={{ resize: 'none' }}
    />
  );
}
