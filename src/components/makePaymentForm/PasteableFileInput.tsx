import React, { useEffect, useCallback } from 'react';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import {
  Flex,
  Text,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';

interface PastableFileInputProps extends Omit<DropzoneProps, 'children'> {
  onPasteFile?: (files: File[]) => void;
}

const PastableFileInput: React.FC<PastableFileInputProps> = ({
  onDrop,
  onReject,
  onPasteFile,
  maxSize = 5 * 1024 ** 2,
  accept = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  ...props
}) => {
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        onPasteFile?.(imageFiles);
        onDrop(imageFiles);
      }
    },
    [onDrop, onPasteFile]
  );

  useEffect(() => {
    const handlePasteWrapper = (event: Event) => {
      if ('clipboardData' in event) {
        handlePaste(event as ClipboardEvent);
      }
    };

    window.addEventListener('paste', handlePasteWrapper);
    return () => window.removeEventListener('paste', handlePasteWrapper);
  }, [handlePaste]);

  const handleManualPaste = async () => {
    if (!navigator.clipboard?.read) {
      showNotification?.({
        title: 'Clipboard not supported',
        message: 'Your browser does not support reading images from the clipboard.',
        color: 'red',
      });
      return;
    }

    try {
      const clipboardItems = await navigator.clipboard.read();
      const imageFiles: File[] = [];

      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], 'pasted-image', { type: blob.type });
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        onPasteFile?.(imageFiles);
        onDrop(imageFiles);
      } else {
        showNotification?.({
          title: 'No image found',
          message: 'Please copy an image to clipboard and try again.',
          color: 'yellow',
        });
      }
    } catch (error) {
      console.error('Clipboard read failed:', error);
      showNotification?.({
        title: 'Paste failed',
        message: 'Permission denied or unsupported browser.',
        color: 'red',
      });
    }
  };

  return (
    <Stack spacing="xs" align="stretch" w="100%">
      <Dropzone
        onDrop={onDrop}
        onReject={onReject}
        maxSize={maxSize}
        accept={accept}
        {...props}
        styles={{
          root: {
            border: '1px solid #ced4da',
            borderRadius: '4px',
            backgroundColor: '#fff',
            padding: '10px 14px',
            height: '40px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          },
          inner: {
            pointerEvents: 'none',
            height: '100%',
          },
        }}
      >
        <Flex align="center" style={{ height: '100%' }}>
          <Text size="sm" color="dimmed">
            Upload image
          </Text>
        </Flex>
      </Dropzone>

      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={handleManualPaste}
      >
        Paste Image
      </Button>
    </Stack>
  );
};

export default PastableFileInput;
