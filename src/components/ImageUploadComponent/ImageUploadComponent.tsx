import React, { useState, useCallback, useEffect } from 'react';
import { Box, ActionIcon, Tooltip, Paper, Text, Group, Modal, Image, Badge } from '@mantine/core';
import { IconUpload, IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useDropzone } from 'react-dropzone';
import './ImageUploadComponent.css';
import { ImageUploadComponentProps } from 'src/types';

export const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  onImagesChange,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, 
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  initialImages = [],
  disabled = false,
  className = '',
  size = 24,
  previewSize = 40,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialImages);
  const [errors, setErrors] = useState<string[]>([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(file => {
        if (file.errors[0].code === 'file-too-large') {
          return `File ${file.file.name} is too large`;
        }
        if (file.errors[0].code === 'file-invalid-type') {
          return `File ${file.file.name} is not a valid image type`;
        }
        return `Error with file ${file.file.name}`;
      });
      setErrors(prev => [...prev, ...newErrors]);
    }

    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);

    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews].slice(0, maxFiles));

    onImagesChange?.(newFiles);
  }, [files, maxFiles, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    maxFiles,
    disabled,
  });

  const removeImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
    onImagesChange?.(files.filter((_, i) => i !== index));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const openPreview = (index: number) => {
    setCurrentPreviewIndex(index);
    setPreviewModalOpen(true);
  };

  const navigatePreview = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentPreviewIndex(prev => (prev > 0 ? prev - 1 : previews.length - 1));
    } else {
      setCurrentPreviewIndex(prev => (prev < previews.length - 1 ? prev + 1 : 0));
    }
  };

  useEffect(() => {
    const initialPreviews = initialImages.map(image => {
      return image?.secure_url ? image?.secure_url : image;
    })
    setPreviews(initialPreviews);
  }, [initialImages]);
  
  return (
    <Box className={`image-upload-component ${className}`}>
      <Group spacing="xs">
        {previews.length === 0 ? (
          <Tooltip label="Upload images" position="top">
            <ActionIcon
              {...getRootProps()}
              size={size}
              variant="light"
              color="blue"
              disabled={disabled}
              className={`upload-icon ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              <IconUpload size={size * 0.6} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Box className="preview-container">
            <Box className="preview-item">
              <Image
                src={previews[0]}
                alt="Preview"
                width={previewSize}
                height={previewSize}
                radius="md"
                fit="cover"
                onClick={() => openPreview(0)}
                className="preview-image"
              />
              {!disabled && (
                <ActionIcon
                  className="remove-button"
                  color="red"
                  variant="filled"
                  onClick={() => removeImage(0)}
                >
                  <IconX size={16} />
                </ActionIcon>
              )}
              {previews.length > 1 && (
                <Badge
                  className="more-images-badge"
                  color="blue"
                  variant="filled"
                  size="lg"
                  radius="xl"
                >
                  +{previews.length - 1}
                </Badge>
              )}
            </Box>
            <Tooltip label="Add more images" position="top">
              <ActionIcon
                {...getRootProps()}
                size={size}
                variant="light"
                color="blue"
                disabled={disabled || previews.length >= maxFiles}
                className={`upload-icon ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                <IconUpload size={size * 0.6} />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
      </Group>

      {errors.length > 0 && (
        <Paper className="error-container" p="xs" mt="md">
          <Group position="apart">
            <Text color="red" size="sm">
              {errors[0]}
            </Text>
            <ActionIcon onClick={clearErrors} color="red" variant="light">
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Paper>
      )}

      <Modal
        opened={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        size="lg"
        centered
        padding={0}
        withCloseButton={false}
      >
        <Box className="image-modal">
          <Box className="modal-content">
            <Image
              src={previews[currentPreviewIndex]}
              alt={`Preview ${currentPreviewIndex + 1}`}
              fit="contain"
              className="modal-image"
            />
            
            <ActionIcon
              className="modal-close-button"
              color="dark"
              variant="filled"
              onClick={() => setPreviewModalOpen(false)}
            >
              <IconX size={20} />
            </ActionIcon>

            <ActionIcon
              className="modal-nav-button prev"
              color="dark"
              variant="filled"
              onClick={() => navigatePreview('prev')}
            >
              <IconChevronLeft size={20} />
            </ActionIcon>

            <ActionIcon
              className="modal-nav-button next"
              color="dark"
              variant="filled"
              onClick={() => navigatePreview('next')}
            >
              <IconChevronRight size={20} />
            </ActionIcon>

            <ActionIcon
              className="modal-delete-button"
              color="red"
              variant="filled"
              onClick={() => {
                removeImage(currentPreviewIndex);
                setPreviewModalOpen(false);
              }}
            >
              <IconX size={20} />
            </ActionIcon>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}; 