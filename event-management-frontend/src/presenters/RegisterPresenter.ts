import { useMutation } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { RegisterData } from '../models/registerTypes';
import { registerUser } from '../services/authServices';

const RegisterPresenter = () => {
  const history = useHistory();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => registerUser(data),
    onSuccess: () => {
      history.push('/login');
    },
  });

  const onSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return {registerMutation, onSubmit}
};

export default RegisterPresenter;
