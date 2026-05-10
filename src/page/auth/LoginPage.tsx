/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { openSnackbar } from '@redux/slice/snackbar';
import { useLoginMutation } from '@services/rootApi';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import FormField from '../../components/FormField';
import TextInput from '../../components/FormInput/TextInput';
import { motion } from 'framer-motion';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginFormSchema = yup.object().shape({
    email: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(loginFormSchema),
  });

  const [login, { isLoading, data, isSuccess, isError, error }] =
    useLoginMutation();

  function onSubmit(formData: any) {
    login(formData);
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(openSnackbar({ message: data?.message }));
      navigate('/verify', {
        state: {
          email: getValues('email'),
        },
      });
    }

    if (isError && error && 'data' in error) {
      dispatch(
        openSnackbar({ message: (error as any).data?.message, type: 'error' })
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
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Chào mừng trở lại{' '}
          <span className="inline-block bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            👋
          </span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Đăng nhập để tiếp tục hành trình của bạn
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="email"
          label="Email hoặc tên đăng nhập"
          control={control}
          type="text"
          className="w-full"
          placeholder="john.doe@gmail.com"
          Component={TextInput}
          error={errors.email}
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Mật khẩu
            </label>
            <a
              href="/forgot-password"
              className="text-xs font-semibold text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
            >
              Quên mật khẩu?
            </a>
          </div>
          <FormField
            name="password"
            label=""
            control={control}
            type="password"
            className="w-full"
            placeholder="Nhập mật khẩu"
            Component={TextInput}
            error={errors.password}
          />
        </div>

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
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      {/* Register link */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Chưa có tài khoản?{' '}
        <a
          href="/register"
          className="font-semibold text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
        >
          Đăng ký ngay
        </a>
      </p>
    </motion.div>
  );
}

export default LoginPage;
