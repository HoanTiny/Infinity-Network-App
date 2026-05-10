/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { openSnackbar } from '@redux/slice/snackbar';
import { useResetPasswordMutation } from '@services/rootApi';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import FormField from '../../components/FormField';
import TextInput from '../../components/FormInput/TextInput';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col gap-5 w-full"
    >
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 dark:from-violet-500/20 dark:to-pink-500/20 flex items-center justify-center border border-pink-200/50 dark:border-pink-800/30">
          <KeyRound size={26} className="text-pink-500" strokeWidth={1.6} />
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Đặt lại mật khẩu
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Nhập mã từ email và mật khẩu mới của bạn.
        </p>
        {email && (
          <span className="text-xs font-medium text-pink-500 mt-0.5">{email}</span>
        )}
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="token"
          label="Mã xác nhận"
          control={control}
          type="text"
          className="w-full"
          placeholder="Nhập mã từ email của bạn"
          Component={TextInput}
          error={errors.token}
        />

        <FormField
          name="password"
          label="Mật khẩu mới"
          control={control}
          type="password"
          className="w-full"
          placeholder="Tối thiểu 6 ký tự"
          Component={TextInput}
          error={errors.password}
        />

        <FormField
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          control={control}
          type="password"
          className="w-full"
          placeholder="Nhập lại mật khẩu mới"
          Component={TextInput}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={[
            'w-full h-12 rounded-2xl text-white font-semibold text-sm mt-1',
            'bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400',
            'shadow-lg shadow-pink-500/25',
            'hover:shadow-pink-500/40 hover:-translate-y-0.5',
            'active:translate-y-0 active:shadow-md',
            'transition-all duration-300',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg',
            'flex items-center justify-center gap-2',
          ].join(' ')}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            'Đặt lại mật khẩu'
          )}
        </button>
      </form>

      {/* Back link */}
      <a
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        Quay lại đăng nhập
      </a>
    </motion.div>
  );
}

export default ResetPasswordPage;
