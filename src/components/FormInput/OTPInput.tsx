import { MuiOtpInput } from 'mui-one-time-password-input';

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function OTPInput({ value, onChange }: TextInputProps) {
  return (
    <MuiOtpInput
      value={value}
      onChange={onChange}
      length={6}
      autoFocus
      gap={1}
      TextFieldsProps={{
        InputProps: {
          sx: {
            borderRadius: '14px',
            height: '52px',
            fontSize: '22px',
            fontWeight: 700,
            color: '#111827',
            backgroundColor: '#f9fafb',
            transition: 'box-shadow 0.2s, border-color 0.2s',
            '& fieldset': {
              borderColor: '#e5e7eb',
              borderWidth: '2px',
              borderRadius: '14px',
            },
            '&:hover fieldset': {
              borderColor: '#d1d5db',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ec4899 !important',
              borderWidth: '2px !important',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(236,72,153,0.15)',
              borderRadius: '14px',
            },
          },
        },
        inputProps: {
          style: {
            textAlign: 'center',
            padding: 0,
            fontWeight: 700,
            letterSpacing: '0.05em',
          },
        },
      }}
    />
  );
}

export default OTPInput;
