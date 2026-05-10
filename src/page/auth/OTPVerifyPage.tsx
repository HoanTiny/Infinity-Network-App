/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import FormField from '../../components/FormField';
import OTPInput from '../../components/FormInput/OTPInput';
import { useVerifyOTPMutation } from '@services/rootApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '@redux/slice/snackbar';
import { login } from '@redux/slice/authSlice';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

function OTPVerifyPage() {
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyOTP, { isLoading, data, isSuccess, isError, error }] =
    useVerifyOTPMutation();

  function onSubmit(formData: any) {
    verifyOTP({
      otp: formData.otp,
      email: location?.state?.email,
    });
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(openSnackbar({ message: data?.message }));
      dispatch(login(data));
      navigate('/');
    }
    if (isError && error && 'data' in error) {
      dispatch(
        openSnackbar({ message: (error as any).data?.message, type: 'error' })
      );
    }
  }, [isSuccess, isError, data, dispatch, error, navigate]);

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
          <ShieldCheck size={26} className="text-pink-500" strokeWidth={1.6} />
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Xác minh 2 bước
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Chúng tôi đã gửi mã xác minh đến thiết bị của bạn.
          <br />
          Nhập mã 6 chữ số bên dưới.
        </p>
        <div className="inline-flex justify-center mt-1">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-xl tracking-widest">
            ••••••6789
          </span>
        </div>
      </div>

      {/* OTP Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="otp"
          label=""
          control={control}
          type="text"
          className="w-full"
          placeholder=""
          Component={OTPInput}
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
              <span>Đang xác minh...</span>
            </>
          ) : (
            'Xác minh tài khoản'
          )}
        </button>
      </form>

      {/* Resend */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Chưa nhận được mã?{' '}
        <a
          href="/register"
          className="font-semibold text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
        >
          Gửi lại
        </a>
      </p>
    </motion.div>
  );
}

export default OTPVerifyPage;
