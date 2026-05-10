import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type TextInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  className: string;
  placeholder: string;
  error?: string;
};

function TextInput({ name, value, onChange, type = 'text', className, placeholder, error }: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`relative ${className}`}>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={inputType}
        placeholder={placeholder}
        autoComplete={isPassword ? 'current-password' : 'on'}
        className={[
          'w-full h-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800/60',
          'text-gray-900 dark:text-gray-100 text-sm font-medium',
          'placeholder:text-gray-400/90 dark:placeholder:text-gray-500',
          'outline-none transition-all duration-300',
          isPassword ? 'pl-4 pr-12' : 'px-4',
          error
            ? 'border-red-300 dark:border-red-700 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
            : 'border-gray-200 dark:border-gray-700 focus:border-pink-400 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-pink-500/20',
        ].join(' ')}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff size={17} strokeWidth={1.8} />
          ) : (
            <Eye size={17} strokeWidth={1.8} />
          )}
        </button>
      )}
    </div>
  );
}

export default TextInput;
