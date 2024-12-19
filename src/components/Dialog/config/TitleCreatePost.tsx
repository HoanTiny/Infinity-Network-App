import { Typography } from '@mui/material';
import { closeDialog } from '@redux/slice/dialogSlice';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';

function TitleCreatePost() {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center border-b-2 pb-2 cursor-pointer">
      <Typography variant="h6">Create Post</Typography>
      <CloseIcon
        onClick={() => {
          dispatch(closeDialog());
        }}
      />
    </div>
  );
}

export default TitleCreatePost;
