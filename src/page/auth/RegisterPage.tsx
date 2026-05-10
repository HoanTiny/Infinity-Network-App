/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import FormField from '../../components/FormField';
import TextInput from '../../components/FormInput/TextInput';
import { useRegisterMutation } from '@services/rootApi';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { openSnackbar } from '@redux/slice/snackbar';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';

function RegisterPage() {
  const formSchema = yup.object().shape({
    fullName: yup
      .string()
      .required('Full Name is required')
      .min(3, 'Full Name must be at least 3 characters'),
    email: yup.string().email().required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });
  const [register, { isLoading, data, error, isError, isSuccess }] =
    useRegisterMutation();
  const dispatch = useDispatch();

  function onSubmit(formData: any) {
    register(formData);
  }

  useEffect(() => {
    if (error && 'data' in error) {
      console.log('data', error.data);
    }
    if (isSuccess) {
      dispatch(
        openSnackbar({ message: 'Register successfully', type: 'success' })
      );
    }

    if (isError && error && 'data' in error) {
      dispatch(
        openSnackbar({ message: (error as any).data?.message, type: 'error' })
      );
    }
  }, [dispatch, isSuccess, isError, error]);
  console.log(`data, isLoading`, data, isLoading, errors);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col gap-5 w-full"
    >
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Bắt đầu hành trình{' '}
          <span className="inline-block bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            🚀
          </span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tạo tài khoản mạng xã hội của bạn ngay hôm nay
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="fullName"
          label="Tên đăng nhập"
          control={control}
          type="text"
          className="w-full"
          placeholder="john.doe"
          Component={TextInput}
          error={errors.fullName}
        />
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
        <FormField
          name="password"
          label="Mật khẩu"
          control={control}
          type="password"
          className="w-full"
          placeholder="Tối thiểu 6 ký tự"
          Component={TextInput}
          error={errors.password}
        />

        {/* Submit button */}
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
              <span>Đang tạo tài khoản...</span>
            </>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Đã có tài khoản?{' '}
        <a
          href="/login"
          className="font-semibold text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
        >
          Đăng nhập
        </a>
      </p>
    </motion.div>
  );
}

export default RegisterPage;
