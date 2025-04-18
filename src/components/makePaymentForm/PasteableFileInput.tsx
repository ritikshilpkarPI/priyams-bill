import React, { useEffect, useCallback } from 'react';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { Flex, Text } from '@mantine/core';

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
    (event: Event) => {
      const clipboardEvent = event as ClipboardEvent;
      const items = clipboardEvent.clipboardData?.items;
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
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <Dropzone
      onDrop={onDrop}
      onReject={onReject}
      maxSize={maxSize}
      accept={accept}
      {...props}
    >
      <Flex
        justify="center"
        align="center"
        mih={120}
        style={{ pointerEvents: 'none' }}
      >
        <div>
          <Text size="xl" inline>
            Drag, select or paste image
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Each image must be under 5 MB
          </Text>
        </div>
      </Flex>
    </Dropzone>
  );
};

export default PastableFileInput;
