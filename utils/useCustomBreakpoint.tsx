import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, useEffect } from 'react';

const useCurrentBreakpoint = (): Breakpoint | undefined => {
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
    const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isXl = useMediaQuery(theme.breakpoints.up('lg'));

    const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint | undefined>(undefined);

    useEffect(() => {
      if (isXs) setCurrentBreakpoint('xs');
      else if (isSm) setCurrentBreakpoint('sm');
      else if (isMd) setCurrentBreakpoint('md');
      else if (isLg) setCurrentBreakpoint('lg');
      else if (isXl) setCurrentBreakpoint('xl');
    }, [isXs, isSm, isMd, isLg, isXl]);

    return currentBreakpoint;
  };

  export default useCurrentBreakpoint;