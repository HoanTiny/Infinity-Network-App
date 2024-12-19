/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, TextField } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { openDialog } from '@redux/slice/dialogSlice';
import { useDispatch } from 'react-redux';

function PostCreation() {
  const dispatch = useDispatch();

  return (
    <div className="flex px-5 py-6 gap-4 w-full justify-between shadow-4xl bg-white items-center text-[#4B465C]">
      <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
      <TextField
        name="mind"
        placeholder="What's on your mind?"
        className="flex-1 rounded-[4px] border-[#DBDADE]"
        onClick={() => {
          console.log('Clicked on');
          dispatch(
            openDialog({
              title: 'TITLE_CREATE_POST',
              content: 'NEW_CONTENT_DIALOG',
              actions: 'Post',
              maxWidth: 'md',
              fullWidth: true,
            })
          );
        }}
      ></TextField>
    </div>
  );
}

export default PostCreation;
