import { useMediaQuery, useTheme } from '@mui/material';

export function useMediumScreen() {
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  return mediumScreen;
}
