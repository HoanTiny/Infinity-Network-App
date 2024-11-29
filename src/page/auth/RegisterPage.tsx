/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import FormField from '../../components/FormField';
import TextInput from '../../components/FormInput/TextInput';
import { Alert, Button } from '@mui/material';
import { useRegisterMutation } from '@services/rootApi';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { openSnackbar } from '@redux/slice/snackbar';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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
    console.log(`data`, { formData });
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
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-[22px]">Adventure starts here 🚀</h2>
        <p className="text-[15px]">Make your favorite social network account</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="fullName"
          label="UserName"
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
          label="Password"
          control={control}
          type="password"
          className="w-full  "
          placeholder="********"
          Component={TextInput}
          error={errors.password}
        />

        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
      </form>
      {isError && error && 'data' in error && (
        <Alert severity="error">{(error as any).data?.message}</Alert>
      )}
      <div className="flex">
        <p className="mr-1">Already have an account?</p>
        <a href="/login" className="text-[#246AA3]">
          Sign in instead
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
