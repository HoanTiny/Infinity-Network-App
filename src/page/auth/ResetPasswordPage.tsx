/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress } from '@mui/material';
import { openSnackbar } from '@redux/slice/snackbar';
import { useResetPasswordMutation } from '@services/rootApi';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import FormField from '../../components/FormField';
import TextInput from '../../components/FormInput/TextInput';

function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as any)?.email || '';

  const resetPasswordSchema = yup.object().shape({
    token: yup.string().required('Token is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const [
    resetPassword,
    { isLoading, data, isSuccess, isError, error },
  ] = useResetPasswordMutation();

  function onSubmit(formData: any) {
    if (!email) {
      dispatch(
        openSnackbar({
          message: 'Email not found. Please try again.',
          type: 'error',
        })
      );
      navigate('/forgot-password');
      return;
    }

    resetPassword({
      email,
      token: formData.token,
      password: formData.password,
    });
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        openSnackbar({
          message: data?.message || 'Password reset successfully',
          type: 'success',
        })
      );
      navigate('/login');
    }

    if (isError && error && 'data' in error) {
      dispatch(
        openSnackbar({
          message: (error as any).data?.message,
          type: 'error',
        })
      );
    }
  }, [dispatch, isSuccess, isError, error, navigate, data]);

  // Check if email is present
  useEffect(() => {
    if (!email) {
      dispatch(
        openSnackbar({
          message: 'Email not found. Please request reset password again.',
          type: 'error',
        })
      );
      setTimeout(() => navigate('/forgot-password'), 2000);
    }
  }, [email, dispatch, navigate]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-[22px]">Reset Password 🔑</h2>
        <p className="text-[15px]">
          Enter the code from your email and your new password.
        </p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="token"
          label="Verification Code (Token)"
          control={control}
          type="text"
          className="w-full"
          placeholder="Enter the code from your email"
          Component={TextInput}
          error={errors.token}
        />

        <FormField
          name="password"
          label="New Password"
          control={control}
          type="password"
          className="w-full"
          placeholder="********"
          Component={TextInput}
          error={errors.password}
        />

        <FormField
          name="confirmPassword"
          label="Confirm New Password"
          control={control}
          type="password"
          className="w-full"
          placeholder="********"
          Component={TextInput}
          error={errors.confirmPassword}
        />

        <Button variant="contained" color="primary" type="submit">
          {isLoading && <CircularProgress size={20} className="mr-2" />}
          Reset Password
        </Button>

        <div className="flex justify-center">
          <a href="/login" className="text-[#246AA3]">
            Back to Login
          </a>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
