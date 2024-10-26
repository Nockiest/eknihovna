import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, useEffect } from 'react';
/**
 * Custom hook that returns the current breakpoint based on the theme breakpoints.
 * @returns The current breakpoint or undefined if not matched.
 */
const useCurrentBreakpoint = (): Breakpoint | undefined => {
    const theme = useTheme();

    // const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    // const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
    // const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    // const isLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    // const isXl = useMediaQuery(theme.breakpoints.up('lg'));

    const getCurrentBreakpoint = () => {
      if (useMediaQuery(theme.breakpoints.down('xs'))) return 'xs';
      if (useMediaQuery(theme.breakpoints.between('xs', 'sm'))) return 'sm';
      if (useMediaQuery(theme.breakpoints.between('sm', 'md'))) return 'md';
      if (useMediaQuery(theme.breakpoints.between('md', 'lg'))) return 'lg';
      if (useMediaQuery(theme.breakpoints.up('lg'))) return 'xl';
      return undefined;
    };
    const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint | undefined>(getCurrentBreakpoint());
    useEffect(() => {
      // if (isXs) setCurrentBreakpoint('xs');
      // else if (isSm) setCurrentBreakpoint('sm');
      // else if (isMd) setCurrentBreakpoint('md');
      // else if (isLg) setCurrentBreakpoint('lg');
      // else if (isXl) setCurrentBreakpoint('xl');
      setCurrentBreakpoint(getCurrentBreakpoint());
    // }, [isXs, isSm, isMd, isLg, isXl]);
  }, [theme]);

    return currentBreakpoint;
  };

  export default useCurrentBreakpoint;