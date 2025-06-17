import React, { useState } from 'react';
import { Button, Modal, Image, Group, Text, ActionIcon } from '@mantine/core';
import { IconPhoto, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import './ImagePreview.css';
import { ImagePreviewProps } from 'src/types';



export const ImagePreview: React.FC<ImagePreviewProps> = ({ images, title }) => {
  const [opened, setOpened] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleClose = () => {
    setOpened(false);
    setCurrentIndex(0);
  };

  return (
    <>
      <Button
        variant="subtle"
        leftIcon={<IconPhoto size={16} />}
        onClick={() => setOpened(true)}
        size="xs"
      >
        View Images ({images.length})
      </Button>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={title}
        size="xl"
        centered
        classNames={{
          modal: 'image-preview-modal',
          header: 'image-preview-header',
          body: 'image-preview-body',
        }}
      >
        <div className="image-preview-container">
          <ActionIcon
            variant="filled"
            size="xl"
            radius="xl"
            onClick={handlePrevious}
            className="image-preview-nav-button prev-button"
          >
            <IconChevronLeft size={24} />
          </ActionIcon>

          <div className="image-preview-content">
            <Image
              src={images[currentIndex].secure_url}
              alt={`${title} image ${currentIndex + 1}`}
              fit="contain"
              radius="md"
              className="preview-image"
            />
            <Text size="sm" align="center" mt="md">
              Image {currentIndex + 1} of {images.length}
            </Text>
          </div>

          <ActionIcon
            variant="filled"
            size="xl"
            radius="xl"
            onClick={handleNext}
            className="image-preview-nav-button next-button"
          >
            <IconChevronRight size={24} />
          </ActionIcon>
        </div>
      </Modal>
    </>
  );
}; 