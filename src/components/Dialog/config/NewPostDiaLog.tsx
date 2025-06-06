/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Close } from '@mui/icons-material';
import { useCreatePostMutation } from '@services/postApi';
import { useDispatch } from 'react-redux';
import { closeDialog } from '@redux/slice/dialogSlice';
import { openSnackbar } from '@redux/slice/snackbar';
import UserAvatar from '@components/UserAvatar';

function ImageUploader({ image, setImage }: { image: any; setImage: any }) {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      // Do something with the files
      // console.log('Accepted files:', acceptedFiles);
      setImage(acceptedFiles[0]);
    },
    [setImage]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: { 'image/jpeg': ['.jpg'], 'image/png': ['.png'] },
  });

  return (
    <div>
      {image && (
        <div className="relative">
          <IconButton className="!absolute top-0 right-0">
            <Close
              onClick={() => setImage(null)}
              style={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                zIndex: 1,
                padding: '5px',
              }}
            />
          </IconButton>
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="object-cover w-[500px] h-full mb-2"
          />
        </div>
      )}
      <div
        {...getRootProps({
          className:
            'border rounded py-4 px-6 text-center bg-slate-100 cursor-pointer h-20 flex items-center justify-center w-[500px]',
        })}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div>
        {image?.name && (
          <Stack className="mt-2">
            <Chip
              label={image.name}
              onDelete={() => setImage(null)}
              className="font-bold"
            />
          </Stack>
        )}
      </div>
    </div>
  );
}
function NewPostDiaLog() {
  const [image, setImage] = useState<any>(null);

  const [contentPost, setContentPost] = useState('');
  const [createPost, { isLoading }] = useCreatePostMutation();
  const distpatch = useDispatch();
  const handleCreateNewPost = async () => {
    try {
      const formData = new FormData();
      formData.append('content', contentPost);
      if (image) {
        formData.append('image', image);
      }
      await createPost(formData).unwrap();
      distpatch(closeDialog());
      distpatch(
        openSnackbar({ message: 'Create post success', type: 'success' })
      );
    } catch (error: any) {
      console.log('Error creating post:', error);
      distpatch(openSnackbar({ message: error.data.message, type: 'error' }));
    }
  };

  const isValid = !!(contentPost || image);
  console.log('isValid', isValid);

  return (
    <div>
      <DialogContent>
        <Box className="flex mt-4 flex-col justify-center gap-4">
          <div className="flex gap-4 ">
            <UserAvatar isMyAvatar />
            <div className="">
              <span className="text-[16px]">Trần Ngọc Hoàn</span>
              <div className="flex items-center text-[16px] bg-[#f0f2f5] rounded-lg justify-center">
                <PublicIcon
                  style={{
                    color: 'rgb(179, 179, 179)',
                    fontSize: '14px',
                  }}
                />
                <span className="ml-2 text-[14px]">Public</span>
                <ArrowDropDownIcon />
              </div>
            </div>
          </div>
          <textarea
            placeholder="What's on your mind?"
            className="w-full pl-4 py-2  focus:outline-none resize-none min-h-10 h-[150px] overflow-hidden"
            value={contentPost}
            onChange={(e) => setContentPost(e.target.value)}
          />

          <div>
            <ImageUploader image={image} setImage={setImage} />
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          className="w-full px-4 py-2 bg-[#3f51b5] text-white rounded-lg hover:bg-[#283593]"
          type="submit"
          onClick={handleCreateNewPost}
          disabled={!isValid}
          variant="contained"
        >
          {isLoading && <CircularProgress size={20} className="mr-2" />}
          Post
        </Button>
      </DialogActions>
    </div>
  );
}

export default NewPostDiaLog;
