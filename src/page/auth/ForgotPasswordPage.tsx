/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress } from '@mui/material';
import { openSnackbar } from '@redux/slice/snackbar';
import { useForgotPasswordMutation } from '@services/rootApi';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import FormField from '../../components/FormField';
import TextInput from '../../components/FormInput/TextInput';

function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forgotPasswordSchema = yup.object().shape({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const [
    forgotPassword,
    { isLoading, data, isSuccess, isError, error },
  ] = useForgotPasswordMutation();

  function onSubmit(formData: any) {
    forgotPassword(formData);
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        openSnackbar({
          message: data?.message || 'Password reset email sent successfully',
          type: 'success',
        })
      );
      navigate('/reset-password', { state: { email: getValues('email') } });
    }

    if (isError && error && 'data' in error) {
      dispatch(
        openSnackbar({
          message: (error as any).data?.message,
          type: 'error',
        })
      );
    }
  }, [dispatch, isSuccess, isError, error, navigate, data, getValues]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-[22px]">Forgot Password 🔒</h2>
        <p className="text-[15px]">
          Enter your email address and we'll send you a code to reset your
          password.
        </p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="email"
          label="Email"
          control={control}
          type="text"
          className="w-full"
          placeholder="john.doe@gmail.com"
          Component={TextInput}
          error={errors.email}
        />

        <Button variant="contained" color="primary" type="submit">
          {isLoading && <CircularProgress size={20} className="mr-2" />}
          Send Reset Link
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

export default ForgotPasswordPage;
