/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { openSnackbar } from '@redux/slice/snackbar';
import { useForgotPasswordMutation } from '@services/rootApi';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import FormField from '../../components/FormField';
import TextInput from '../../components/FormInput/TextInput';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';

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
          <Mail size={26} className="text-pink-500" strokeWidth={1.6} />
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Quên mật khẩu?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Nhập email của bạn và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="email"
          label="Địa chỉ Email"
          control={control}
          type="text"
          className="w-full"
          placeholder="john.doe@gmail.com"
          Component={TextInput}
          error={errors.email}
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
              <span>Đang gửi...</span>
            </>
          ) : (
            'Gửi mã xác nhận'
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

export default ForgotPasswordPage;
