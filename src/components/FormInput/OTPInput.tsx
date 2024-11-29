import { MuiOtpInput } from 'mui-one-time-password-input';

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function OTPInput({ value, onChange }: TextInputProps) {
  return (
    <div>
      <MuiOtpInput value={value} onChange={onChange} length={6} autoFocus />
      {/* <MuiOtpInput value={value} onChange={onChange} /> */}
    </div>
  );
}

export default OTPInput;
