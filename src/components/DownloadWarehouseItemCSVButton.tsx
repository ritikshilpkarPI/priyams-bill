import { Button, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import React, { useRef, useState } from 'react';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import WarehouseWorker from 'worker-loader!../workers/WarehouseWorker';

export const DownloadWarehouseItemCSVButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const handleDownload = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      alert('Token not found in cookies');
      return;
    }

    setLoading(true);
    workerRef.current = new WarehouseWorker();

    workerRef.current!.onmessage = (event: MessageEvent) => {
      const { status, csv, error } = event.data;

      if (status === 'success') {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } else {
        alert('Failed to generate CSV.');
      }

      setLoading(false);
      workerRef.current?.terminate();
    };

    workerRef.current!.postMessage({ token });
  };

  return (
    <Button  
      loading={loading} 
      variant="light" 
      color="teal"
      onClick={handleDownload}
      sx={{display:"flex", alignItems:"center", justifyContent:"center"}}
    >
      {!loading && <IconDownload stroke={2}  />}
      <Text ml="md" size="sm"> {loading ? 'Preparing CSV...' : 'Download CSV'}</Text>
    </Button>
  );
};
