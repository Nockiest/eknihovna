import { PrimaryButton } from '@/theme/buttons/Buttons'
import React from 'react'
import type {  Metadata } from "next";
export const metadata: Metadata = {
  title: "Kontakt na G.O. knihovnu",
  description: "Kontakt na knihovnu",
};
const page = () => {
  return (
    <div>
          <PrimaryButton variant="contained">Primary Button</PrimaryButton>

    </div>
  )
}

export default page