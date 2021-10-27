import React, { useState } from 'react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import { EnvelopeIcon, LockIcon } from '../../assets/Icons';

import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { CircularProgress } from '@material-ui/core';

import { FormContainer } from './styles';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import { queryClient } from '../../services/reactQuery/queryClient';
import { api } from '../../services/client';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

type LoginCredentialsType = {
  email: string;
  password: string;
};

const loginFormSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6).max(14),
});

export const SignInForm = () => {
  const { signIn } = useAuth();
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
  } = useForm<LoginCredentialsType>({
    resolver: yupResolver(loginFormSchema),
  });
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  const isLoginValid = !Object.keys(errors).length ? false : true;

  const onSubmit: SubmitHandler<LoginCredentialsType> = async (values) => {
    await signIn(values);
  };

  return (
    <FormContainer autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <h1>Estamos quase lá.</h1>
      <p>Faça seu login para começar uma experiência incrível.</p>

      <div>
        <Controller
          control={control}
          name="email"
          render={({ field: { value = '', onChange } }) => (
            <Input
              id="email"
              type="email"
              placeholder="E-mail"
              startIcon={<EnvelopeIcon />}
              value={value}
              onChange={onChange}
              filled={!errors['email'] && value !== ''}
              error={errors['email']}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value = '', onChange } }) => (
            <Input
              id="password"
              placeholder="Senha"
              type={isVisiblePass ? 'text' : 'password'}
              required
              autoComplete="off"
              startIcon={<LockIcon />}
              endIcon={
                <IconActive
                  size={24}
                  id="passwordIcon"
                  onClick={() => setIsVisiblePass(!isVisiblePass)}
                  isVisiblePass={isVisiblePass}
                />
              }
              value={value}
              onChange={onChange}
              filled={!errors['password'] && value !== ''}
              error={errors['password']}
            />
          )}
        />

        <Link href="/forgotPassword">
          <a className="forgetPassTxt">Esqueci minha senha</a>
        </Link>

        <Button
          disabled={isLoginValid}
          containerClass="sendBtn"
          loading={isSubmitting}
          loadingSize={25}
        >
          Login
        </Button>
        <Link href="/register" passHref>
          <a>
            <Button variant="transparent">Criar conta gratuita</Button>
          </a>
        </Link>
      </div>
    </FormContainer>
  );
};

const IconActive = ({ isVisiblePass, ...rest }: any) => {
  return isVisiblePass ? <FiEye {...rest} /> : <FiEyeOff {...rest} />;
};
