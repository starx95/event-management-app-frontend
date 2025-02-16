import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { loginUser, isAuthenticated, storeToken, LoginResponse, LoginData } from '../models/authModel';
import { AxiosResponse } from 'axios';
import { login } from '../api/api';

export const useLoginPresenter = () => {
  const history = useHistory();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      history.push('/events');
    } else {
      setIsCheckingAuth(false);
    }
  }, [history]);

  const loginMutation = useMutation<AxiosResponse<LoginResponse>, Error, LoginData>({
      mutationFn: login,
      onSuccess: (data) => {
        localStorage.setItem('token', data.data.accessToken);
        window.location.href = "/events";
      },
    });
  
  return {
    isCheckingAuth,
    loginMutation,
  };
};
