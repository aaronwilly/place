import React, { useRef } from 'react';
import Modal from 'react-modal';
import useWindowSize from '../../hooks/useWindowSize';

const LayoutModal = (props) => {

  const { width } = useWindowSize();
  const ref = useRef();

  const { isOpen, onRequestClose, title, description, children, hiddenClose, onClose } = props

  return (
    <Modal
      ref={ref}
      style={width > 900 ? windowStyles : mobileStyles}
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={onRequestClose}
      {...props}
    >
      {!hiddenClose && <span aria-hidden="true" className="icon_close_alt2 right-icon color-b" onClick={onClose} />}

      <h3 className="fs-20 color-sky text-center px-4">{title}</h3>

      <p className={`${width > 600 ? 'fs-20' : 'fs-14'} fw-medium color-b text-center`}>{description}</p>

      <div className="color-b">{children}</div>
    </Modal>
  );
};

export default LayoutModal;

const windowStyles = {
  content: {
    background: '#111',
    top: 450,
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#222',
    width: 580,
    maxHeight: 750,
    // border: "none",
    borderRadius: 12,
    zIndex: 9999,
    padding: 20,
    border: '3px solid #0075ff',
    boxShadow: '0px 2px 16px -1px rgba(0, 45, 100, 0.83)'
  },
};

const mobileStyles = {
  content: {
    background: '#111',
    top: 360,
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#222',
    width: 'calc(100% - 30px)',
    border: '4px solid #8365e2',
    borderRadius: 12,
    zIndex: 9999,
    padding: 12,
    maxHeight: 590
  },
};
