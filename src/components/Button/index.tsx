/* eslint-disable @typescript-eslint/no-explicit-any */
import { CircularProgress, Button as MuiButton } from '@mui/material';

interface ButtonProps {
  isLoading: boolean;
  onClick?: () => void;
  icon?: any;
  variant: 'contained' | 'outlined';
  size: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  className?: string;
  sx?: any;
  type?: 'button' | 'submit' | 'reset';
  inputProps?: any;
}

function Button({
  isLoading,
  onClick,
  icon,
  variant,
  size,
  children,
  className = '',
  sx,
  type,
  inputProps = {},
}: ButtonProps) {
  return (
    <MuiButton
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={isLoading}
      className={className}
      sx={sx}
      type={type}
      {...inputProps}
    >
      {isLoading ? <CircularProgress size={20} className="mr-2" /> : icon}{' '}
      {children}
    </MuiButton>
  );
}

export default Button;
