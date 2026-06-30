/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAvatar from '@components/UserAvatar';
import { TextField } from '@mui/material';
import { openDialog } from '@redux/slice/dialogSlice';
import { useDispatch } from 'react-redux';
import { Image as ImageIcon, Video as VideoIcon, Smile } from 'lucide-react';

function PostCreation() {
  const dispatch = useDispatch();

  return (
    <div className="bg-ig-bg rounded-xl shadow-md border border-ig-border p-4">
      <div className="flex gap-3 items-center">
        <div className="story-ring p-0.5 flex-shrink-0">
          <div className="bg-ig-bg p-0.5 rounded-full">
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
              className: 'rounded-full !py-3 !px-4 transition-colors cursor-pointer',
              sx: {
                background: 'var(--ig-hover)',
                '&:hover': { background: 'var(--ig-border)' },
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
                fontSize: '15px',
                color: 'var(--ig-muted)',
                '& input::placeholder': { color: 'var(--ig-muted)', opacity: 1 },
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
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ig-border">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ig-hover transition-colors flex-1 justify-center text-ig-muted hover:text-ig-text">
          <ImageIcon size={18} className="text-green-500" />
          <span className="text-sm font-medium">Photo</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ig-hover transition-colors flex-1 justify-center text-ig-muted hover:text-ig-text">
          <VideoIcon size={18} className="text-red-500" />
          <span className="text-sm font-medium">Video</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ig-hover transition-colors flex-1 justify-center text-ig-muted hover:text-ig-text">
          <Smile size={18} className="text-yellow-500" />
          <span className="text-sm font-medium">Feeling</span>
        </button>
      </div>
    </div>
  );
}

export default PostCreation;
