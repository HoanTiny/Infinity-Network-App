/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAvatar from '@components/UserAvatar';
import { TextField } from '@mui/material';
import { openDialog } from '@redux/slice/dialogSlice';
import { useDispatch } from 'react-redux';

function PostCreation() {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
      <div className="flex gap-3 items-center">
        <div className="story-ring p-0.5 flex-shrink-0">
          <div className="bg-white p-0.5 rounded-full">
            <UserAvatar isMyAvatar size="md" />
          </div>
        </div>
        <TextField
          name="mind"
          placeholder="What's on your mind?"
          fullWidth
          className="flex-1"
          slotProps={{
            input: {
              className: 'bg-gray-50 rounded-full !py-3 !px-4 hover:bg-gray-100 transition-colors cursor-pointer',
              sx: {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
                fontSize: '15px',
                color: '#8e8e8e',
              },
            },
          }}
          onClick={() => {
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
          InputProps={{ readOnly: true }}
        />
      </div>

      {/* Quick actions bar */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-1 justify-center">
          <img src="/icons/photo.svg" alt="photo" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-600">Photo</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-1 justify-center">
          <img src="/icons/video.svg" alt="video" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-600">Video</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-1 justify-center">
          <img src="/icons/feeling.svg" alt="feeling" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-600">Feeling</span>
        </button>
      </div>
    </div>
  );
}

export default PostCreation;
