import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import Modal, { Styles } from 'react-modal';
import { toast } from 'react-toastify';

import { Button } from 'components/Form/Button';
import { IUser, IUserUpdateRequestDTO } from 'interfaces/auth';
import AuthService from 'services/AuthService';
import { ToastifyCustomMessage } from 'styles/ToastifyCustomMessage';

import { UsersForm } from '../Form';
import * as S from './styles';

const customStyles: Styles = {
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    margin: '0 auto',
  },
  overlay: {
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

Modal.setAppElement('#__next');

interface ModalProps {
  modalIsOpen: boolean;
  onRequestClose: () => void;
  userDetails: IUser;
}

export const ModalUserEdit = ({
  modalIsOpen,
  onRequestClose,
  userDetails,
}: ModalProps) => {
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    if (userDetails) {
      reset({
        name: userDetails.name,
        email: userDetails.email,
        is_admin: userDetails.is_admin,
        username: userDetails.username,
        driver_license: userDetails.driver_license,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const handleUpdateUser: SubmitHandler<IUserUpdateRequestDTO> = async (
    data
  ) => {
    try {
      await AuthService.updateUserById(userDetails.id, data);
      toast.success(
        ToastifyCustomMessage({
          message: 'Usuário atualizado com sucesso',
        })
      );
    } catch (err) {
      toast.success(
        ToastifyCustomMessage({
          message: err.message,
        })
      );
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick
      style={customStyles}
      bodyOpenClassName="modalOpen"
      className="modalContent"
    >
      <S.ModalContainer>
        <S.ModalHeader>
          <h1>Editar usuário</h1>
          <FiX size={32} onClick={onRequestClose} />
        </S.ModalHeader>

        <S.ModalContent onSubmit={handleSubmit(handleUpdateUser)}>
          <UsersForm control={control} errors={errors} update />
          <S.ButtonsContainer>
            <Button type="submit">Salvar</Button>
          </S.ButtonsContainer>
        </S.ModalContent>
      </S.ModalContainer>
    </Modal>
  );
};
