/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, Chip, IconButton, Stack } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import PublicIcon from '@mui/icons-material/Public';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Close } from '@mui/icons-material';

function MyDropzone() {
  const [image, setImage] = useState<any>(null);
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log('Accepted files:', acceptedFiles);
    setImage(acceptedFiles[0]);
  }, []);
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
  return (
    <Box className="flex mt-4 flex-col justify-center gap-4">
      <div className="flex gap-4 ">
        <Avatar sx={{ bgcolor: deepOrange[500] }}>H</Avatar>
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
      />

      <div>
        <MyDropzone />
      </div>
    </Box>
  );
}

export default NewPostDiaLog;
