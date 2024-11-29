/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress } from '@mui/material';
import { openSnackbar } from '@redux/slice/snackbar';
import { useLoginMutation } from '@services/rootApi';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import FormField from '../../components/FormField';
import TextInput from '../../components/FormInput/TextInput';

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
    console.log(`data`, { formData });
    login(formData);
  }
  console.log(getValues('email'));
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
  console.log(`data, isLoading`, data, isLoading, errors);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-[22px]">Adventure starts here 🚀</h2>
        <p className="text-[15px]">Welcome to Social Network App</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="email"
          label="Email or UserName"
          control={control}
          type="text"
          className="w-full  "
          placeholder="john.doe"
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

        <div className="flex justify-end">
          <a href="/forgot-password" className="text-[#246AA3]">
            Forgot password?
          </a>
        </div>

        <Button variant="contained" color="primary" type="submit">
          {isLoading && <CircularProgress size={20} className="mr-2" />}
          Sign in
        </Button>

        <div className="flex">
          <p className="mr-1">Don't have an account?</p>
          <a href="/register" className="text-[#246AA3]">
            Sign up instead
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
