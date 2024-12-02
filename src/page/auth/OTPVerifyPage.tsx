/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import FormField from '../../components/FormField';
import OTPInput from '../../components/FormInput/OTPInput';
import { Button, CircularProgress } from '@mui/material';
import { useVerifyOTPMutation } from '@services/rootApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '@redux/slice/snackbar';
import { login } from '@redux/slice/authSlice';

function OTPVerifyPage() {
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyOTP, { isLoading, data, isSuccess, isError, error }] =
    useVerifyOTPMutation();

  function onSubmit(formData: any) {
    console.log(`data`, { formData });
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
  console.log(isLoading, data, isSuccess, isError, error, location);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-bold">Two-Step Verification 💬</h3>
          <p>
            We sent a verification code to your mobile. Enter the code from the
            mobile in the field below.
          </p>
          <p>******6789</p>
        </div>
        <p className="font-[600] text-[15px] mb-1">
          Type your 6 digit security code
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="otp"
          label=""
          control={control}
          type="text"
          className="w-full  "
          placeholder="john.doe"
          Component={OTPInput}
        />

        <Button type="submit" variant="contained" color="primary">
          {isLoading && <CircularProgress size={20} className="mr-2" />}
          Verify my account
        </Button>
      </form>

      <div className="flex">
        <p className="mr-1">Didn't get the code? </p>
        <a href="/register" className="text-[#246AA3]">
          Resend
        </a>
      </div>
    </div>
  );
}

export default OTPVerifyPage;
