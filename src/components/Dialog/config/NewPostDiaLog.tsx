/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import PublicIcon from '@mui/icons-material/Public';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function MyDropzone() {
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log('Accepted files:', acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}
function NewPostDiaLog() {
  return (
    <Box className="flex mt-4 flex-col justify-center gap-4 w-full] ">
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
