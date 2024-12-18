/* eslint-disable @typescript-eslint/no-explicit-any */
import { DialogContent, Dialog as MUIDialog } from '@mui/material';
import { closeDialog } from '@redux/slice/dialogSlice';
import { useDispatch, useSelector } from 'react-redux';

function Dialog() {
  const dispatch = useDispatch();
  const openDialog = useSelector((store: any) => store.dialog?.open);

  return (
    <div>
      <MUIDialog open={openDialog} onClose={() => dispatch(closeDialog())}>
        <DialogContent>
          This is a simple dialog. Click outside or press the 'ESC' key to close
          it.
        </DialogContent>
      </MUIDialog>
    </div>
  );
}

export default Dialog;
