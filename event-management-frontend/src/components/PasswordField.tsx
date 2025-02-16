import { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UseFormRegister } from 'react-hook-form';

interface PasswordFieldProps {
  register: UseFormRegister<any>;
  error?: any;
}

const PasswordField = ({ register, error }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <TextField
      {...register("password")}
      label="Password"
      type={showPassword ? "text" : "password"}
      variant="outlined"
      fullWidth
      margin="normal"
      error={!!error}
      helperText={error?.message}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;