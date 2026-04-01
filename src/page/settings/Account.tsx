/* eslint-disable @typescript-eslint/no-explicit-any */
import FormField from '@components/FormField';
import TextArea from '@components/FormInput/TextArea';
import TextInput from '@components/FormInput/TextInput';
import ImageUpload from '@components/ImageUpload';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUserInfo } from '@hooks/getUserinfo';
import { useUpdateUserProfileMutation } from '@services/userApi';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Button from '@components/Button';

const Account = () => {
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { about, fullName } = useUserInfo();

  const settingFormSchema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    about: yup.string().max(500, 'About me cannot exceed 500 characters'),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(settingFormSchema),
    defaultValues: {
      fullName,
      about,
    },
  });

  const { image, coverImage } = useUserInfo();

  console.log('userInfo', { image, coverImage });

  const onSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    updateUserProfile(data)
      .unwrap()
      .then((response: any) => {
        console.log('Profile updated successfully:', response);
        toast.success('Profile updated successfully');
        reset(data); // Reset form with the new data
      })
      .catch((error: any) => {
        console.error('Error updating profile:', error);
        toast.error(error?.data?.message || 'Error updating profile');
      });
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto p-6 ">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl mb-2 border-b-2 border-gray-200 pb-2">
            Profile Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Avatar Upload */}
            <ImageUpload
              label="Avatar Image"
              currentImage={image ?? ''}
              isCover={false}
            />
            {/* Cover Image Upload */}
            <ImageUpload
              label="Cover Image"
              isCover={true}
              currentImage={coverImage ?? ''}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="mb-4">
              <FormField
                name="fullName"
                label="Full Name"
                control={control}
                type="text"
                className="w-full  "
                placeholder="john.doe"
                Component={TextInput}
                error={errors.fullName}
              />
            </div>
            <div className="mb-4">
              <FormField
                name="about"
                label="About Me"
                control={control}
                type="text"
                className="w-full  "
                placeholder="john.doe"
                Component={TextArea}
                error={errors.about}
              />
            </div>
            <Button
              variant="contained"
              type="submit"
              size="small"
              isLoading={isLoading}
              inputProps={{ disabled: !isDirty }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
