import React, { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
// import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordEntryProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({
  label,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label={label}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end">
              <Image
                src={showPassword ? "icon/eye-open.svg" : "icon/eye-closed.svg"}
                alt={showPassword ? "openeye" : "closedeye"}
                width={32}
                height={32}
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordEntry;
