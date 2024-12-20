/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DialogActions,
  DialogContent,
  // DialogContent,
  DialogTitle,
  Dialog as MUIDialog,
} from '@mui/material';
import { closeDialog } from '@redux/slice/dialogSlice';
import { useDispatch, useSelector } from 'react-redux';
import NewPostDiaLog from './config/NewPostDiaLog';
import TitleCreatePost from './config/TitleCreatePost';

const DynamicContent = ({ contentType }: { contentType: string }) => {
  switch (contentType) {
    case 'NEW_CONTENT_DIALOG':
      return <NewPostDiaLog />;
    case 'TITLE_CREATE_POST':
      return <TitleCreatePost />;
    default:
      return <p>Invalid content type</p>;
  }
};

function Dialog() {
  const dispatch = useDispatch();
  const dialog = useSelector((store: any) => store.dialog);

  return (
    <MUIDialog
      open={dialog.open}
      maxWidth={dialog.maxWidth}
      fullWidth={dialog.fullWidth}
      onClose={() => dispatch(closeDialog())}
      style={{
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <DialogTitle>
        <DynamicContent contentType={dialog.title} />
      </DialogTitle>
      <DialogContent>
        <DynamicContent contentType={dialog.content} />
      </DialogContent>
      <DialogActions>
        <button className="w-full px-4 py-2 bg-[#3f51b5] text-white rounded-lg hover:bg-[#283593]">
          {dialog.actions}
        </button>
      </DialogActions>
    </MUIDialog>
  );
}

export default Dialog;
