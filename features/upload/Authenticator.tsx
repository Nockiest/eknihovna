"use client";
import React, { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import ReroutToAUth from "../../components/ReroutToAUth";
import { splited_emails } from "@/data/values";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { signOut, useSession } from "next-auth/react";
interface AuthenticatorProps {
  children: ReactNode;
}

const AdminPageAuthenticator: React.FC<AuthenticatorProps> = ({ children }) => {
  const { data: session } = useSession({ required: true });

  if (!session) {
    return (
      <Box className="flex flex-col flex-center">
        <ReroutToAUth />
      </Box>
    );
  }
  if (!splited_emails || !session?.user?.email) {
    return (
      <>
        <Typography variant="h6">
          Přihlašování selhalo, chyba je na straně aplikace
        </Typography>
        <PrimaryButton onClick={() => signOut()} sx={{ margin: "2em" }}>
          <Typography>Odhlásit se</Typography>
        </PrimaryButton>
      </>
    );
  }
  if (splited_emails.indexOf(session?.user?.email) < 0) {
    return (
      <>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Neplatný administrátorský účet
        </Typography>
        <PrimaryButton onClick={() => signOut()}>
          <Typography>Odhlásit se</Typography>
        </PrimaryButton>
      </>
    );
  }

  return (
    <>
      {children}
      <PrimaryButton onClick={() => signOut()} sx={{ margin: "2em" }}>
        <Typography>Odhlásit se</Typography>
      </PrimaryButton>
    </>
  );
};

export default AdminPageAuthenticator;
