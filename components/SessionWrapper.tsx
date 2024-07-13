import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SessionProvider, useSession } from 'next-auth/react';
import { CircularProgress, Box } from '@mui/material';

interface SessionWrapperProps {
  children: React.ReactNode;
//   redirectPath?: string;
}

const SessionWrapper: React.FC<SessionWrapperProps> = ({ children  }) => {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push(redirectPath);
//     }
//   }, [status, router, redirectPath]);

//   if (status === 'loading') {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (status === 'authenticated') {
//     return <>{children}</>;
//   }

//   return null;
return (
    <SessionProvider >
        {children}  {/* Your application components go here */}
    </SessionProvider>
)
};

export default SessionWrapper;
