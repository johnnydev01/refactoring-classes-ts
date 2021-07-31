import { Component, ReactNode, useEffect, useState } from 'react';
import ReactModal from 'react-modal';

interface State{
  modalStatus: boolean;
}

interface ModalProps{
  isOpen: boolean;
  children: ReactNode;
  setIsOpen: () => void;
}
export function Modal(props: ModalProps) {
 
    const { isOpen } = props;
  
    const [state, setState] = useState<State>({
      modalStatus: isOpen
    })

    useEffect(()=>{
      setState({ modalStatus: isOpen })
    },[isOpen])

    const { children, setIsOpen } = props;
    const { modalStatus } = state;

    return (
      <ReactModal
        shouldCloseOnOverlayClick={!false}
        onRequestClose={setIsOpen}
        isOpen={modalStatus}
        ariaHideApp={false}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#F0F0F5',
            color: '#000000',
            borderRadius: '8px',
            width: '736px',
            border: 'none',
          },
          overlay: {
            backgroundColor: '#121214e6',
          },
        }}
      >
        {children}
      </ReactModal>
    );
  }

export default Modal;
