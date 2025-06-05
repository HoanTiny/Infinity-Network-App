/* eslint-disable @typescript-eslint/no-explicit-any */
import FormField from '@components/FormField';
import TextInput from '@components/FormInput/TextInput';
import ImageUpload from '@components/ImageUpload';
import { useUserInfo } from '@hooks/getUserinfo';
import { useForm } from 'react-hook-form';

const Account = () => {
  const { control, handleSubmit } = useForm();

  const { image, coverImage } = useUserInfo();

  console.log('userInfo', { image, coverImage });

  const onSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    // Lấy data ảnh từ form
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto p-6 ">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl mb-2 border-b-2 border-gray-200 pb-2">
            Profile Information
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="mb-4">
              <FormField
                name="fullName"
                label="Full Name"
                control={control}
                type="text"
                className="w-full  "
                placeholder="john.doe"
                Component={TextInput}
                // error={errors.email}
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
                Component={TextInput}
                // error={errors.email}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => alert('Changes discarded')}
            >
              Discard Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
