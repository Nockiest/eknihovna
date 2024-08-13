'use client'
import { PrimaryButton } from '@/theme/buttons/Buttons';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react'

const ReroutToAUth = () => {

  const router = useRouter();

  return (
    <PrimaryButton
            onClick={() => {
              // signIn("google");
              router.push("/api/auth/signin?callbackUrl=/upload");
            }}
          >
            <Typography>Přihlaste se pro vstup</Typography>
          </PrimaryButton>
  )
}

export default ReroutToAUth