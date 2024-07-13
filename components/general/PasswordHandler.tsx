'use client'
import React, { useState } from 'react'
import PasswordEntry from './PasswordEntry';
import { PrimaryButton } from '@/theme/buttons/Buttons';
import { authenticate } from '@/utils/authenticate';

const PasswordHandler = () => {
    const [password, setPassword] = useState<string>("");
    const [responseMessage, setResponseMessage] = useState<string>("");
    // const {setIsAuth}= useAuthContext();


  return (
    <form
          onSubmit={async (e) => {
            const res = await authenticate(e, password);
            if (res) {
              setResponseMessage("Authentication successful");
            } else {
              setResponseMessage("Authentication failed");
            }
          }}
          className="min-w-64  w-1/2 flex flex-col items-center justify-center mt-16 mx-auto"
        >
          <label htmlFor="password" className="block mb-2">
            Pro práci s daty vepište heslo:
          </label>
          <PasswordEntry  label="heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />

          <PrimaryButton type="submit">Autorizovat</PrimaryButton>
          <div id="response">{responseMessage}</div>
        </form>
  )
}

export default PasswordHandler