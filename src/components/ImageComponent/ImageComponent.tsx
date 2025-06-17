import React, { useState } from 'react';
import { Modal, Image, Box, CloseButton, MantineNumberSize } from '@mantine/core';
import './ImageComponent.css';
import { ImageComponentProps } from 'src/types';



export const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt = '',
  width = '100%',
  height = 'auto',
  radius = 0,
  fit = 'cover',
  className = '',
  style = {},
  fallbackSrc = 'https://placehold.co/600x400?text=No+Image',
  withModal = true,
  modalSize = 'lg',
  onClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleImageClick = () => {
    if (withModal) {
      setIsModalOpen(true);
    }
    onClick?.();
  };

  const handleImageError = () => {
    setError(true);
  };

  return (
    <>
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        radius={radius}
        fit={fit}
        className={`image-component ${className}`}
        style={style}
        onClick={handleImageClick}
        onError={handleImageError}
      />

      {withModal && (
        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size={modalSize}
          centered
          padding={0}
          withCloseButton={false}
          className="image-modal"
        >
          <Box className="modal-content">
            <CloseButton
              onClick={() => setIsModalOpen(false)}
              className="modal-close-button"
              size="lg"
              variant="filled"
              color="dark"
            />
            <Image
              src={error ? fallbackSrc : src}
              alt={alt}
              fit="contain"
              className="modal-image"
            />
          </Box>
        </Modal>
      )}
    </>
  );
}; 