/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Button from '../Button';
import { useUploadPhotoUserMutation } from '@services/userApi';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

// import { useState } from 'react';

const ImageUpload = ({
  label,
  currentImage = 'https://placehold.co/24x24',
  isCover = false,
}: {
  label: string;
  currentImage: string;
  isCover?: boolean;
}) => {
  //   const [file, setFile] = useState<File | null>(null);

  const [uploadPhotoUser, { isLoading }] = useUploadPhotoUserMutation();

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      // Do something with the files
      const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('isCover', isCover.toString());
        uploadPhotoUser(formData)
          .unwrap()
          .then((response: any) => {
            console.log('Image uploaded successfully:', response);

            toast.success('Image uploaded successfully');
          })
          .catch((error: any) => {
            console.error('Error uploading image:', error);
            toast.error(error?.data?.message || 'Error uploading image');
          });
      }
    },
    [isCover, uploadPhotoUser]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div className="flex-1 flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label || 'Avatar Image'}
        </label>
        <div className="rounded-lg flex items-center mb-2 gap-2">
          {/* Avatar preview */}
          <img
            src={currentImage || 'https://placehold.co/24x24'}
            alt="Avatar"
            className="w-24 h-24 object-cover rounded-lg bg-gray-200"
          />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button variant="contained" size="small" isLoading={isLoading}>
                  Upload new photo
                </Button>
              </div>

              <button
                type="button"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
              >
                Reset
              </button>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              Allowed JPG, GIF or PNG
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
