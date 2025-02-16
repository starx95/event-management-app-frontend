import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginPresenter } from '../presenters/loginPresenter';
import { LoginData } from '../models/authModel';
import { Container, TextField, Button, Typography, Card, CardContent, Box } from "@mui/material";
import PasswordField from '../components/PasswordField';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const LoginView = () => {
  const { loginMutation } = useLoginPresenter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <Container maxWidth="xs">
      <Card elevation={3} sx={{ mt: 6, p: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
            Please enter your credentials to sign in.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("email")}
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <PasswordField register={register} error={errors.password} />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
            >
              Log In as Admin
            </Button>
            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="textSecondary">
                Register an admin account?
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                sx={{ mt: 1, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
                onClick={() => window.location.href = '/register'}
              >
                Register
              </Button>
            </Box>

            {/* Continue as Guest Button */}
            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="textSecondary">
                Or, continue without logging in
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth 
                sx={{ mt: 1, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
                onClick={() => window.location.href = '/events'}
              >
                Continue as Guest
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginView;
