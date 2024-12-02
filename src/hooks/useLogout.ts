import { logOut } from '@redux/slice/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const distpatch = useDispatch();
  const navigate = useNavigate();

  const logOutaction = () => {
    distpatch(logOut());
    navigate('/login', { replace: true });
  };

  return logOutaction;
}
