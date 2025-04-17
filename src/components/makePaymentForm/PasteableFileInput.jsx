import React, { useState, useCallback } from 'react';
import { FileInput, Text } from '@mantine/core';

export function PasteableFileInput({
  label,
  accept,
  required,
  error,
  onChange,
  multiple
}) {
  const [files, setFiles] = useState([]);

  // Handle paste event to extract image files from clipboard
  const handlePaste = useCallback(
    (event) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const items = clipboardData.items;
      if (!items) return;

      let pastedFiles = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const pastedFile = item.getAsFile();
          if (pastedFile) {
            pastedFiles.push(pastedFile);
            // If not supporting multiple, just take the first found image
            if (!multiple) break;
          }
        }
      }

      if (pastedFiles.length > 0) {
        // Prevent default paste behavior
        event.preventDefault();

        // Merge pasted files into the existing array;
        // If not multiple, use just the first file
        const updatedFiles = multiple
          ? [...files, ...pastedFiles]
          : [pastedFiles[0]];

        setFiles(updatedFiles);
        if (onChange) {
          console.log({updatedFiles});
          onChange(updatedFiles);
        }
      }
    },
    [files, onChange, multiple]
  );

  // Handle change event coming from the FileInput
  const handleChange = (newFiles) => {
    setFiles(newFiles);
    console.log({newFiles});
    
    if (onChange) {
      onChange(newFiles);
    }
  };

  return (
    <div onPaste={handlePaste} style={{ padding: 20, border: '1px solid #ddd' }}>
      <Text mb="xs">{label}</Text>
      <FileInput
        placeholder="Pick file(s)"
        value={files}
        onChange={handleChange}
        accept={accept}
        required={required}
        error={error}
        multiple={multiple}
      />
      {files && files.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {files.map((file, index) => (
            <div key={index}>
              <Text size="sm">{file.name}</Text>
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                style={{ marginTop: 10, maxWidth: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </div>
      )}
      <Text size="xs" color="dimmed" mt="sm">
        You can also paste images (Ctrl+V or Command+V) directly into this area.
      </Text>
    </div>
  );
}
