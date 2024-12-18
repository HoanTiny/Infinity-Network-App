import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    '2xl': true; // Add the custom breakpoint
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#246AA3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },
});

export default createTheme(theme);
