import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Typography, Box, CardContent, Card } from '@mui/material';
import { RegisterData } from '../models/registerTypes';
import { useHistory } from 'react-router-dom';
import registerPresenter from '../presenters/RegisterPresenter'
import RegisterPresenter from '../presenters/RegisterPresenter';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
});

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(schema),
    });
  const { onSubmit } = RegisterPresenter();
  const history = useHistory();

  return (
    <Card elevation={3} sx={{ mt: 6, p: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Create an Account
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
          Sign up to manage your events.
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email')}
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register('password')}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            {...register('confirmPassword')}
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
          >
            Register
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">Already have an account?</Typography>
          <Button 
            onClick={() => history.push('/login')} 
            color="secondary"
            sx={{ fontWeight: "bold" }}
          >
            Login
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
