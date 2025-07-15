import React, { useEffect, useState } from 'react';
import { Button, Table, Checkbox, Group, Loader, Text } from '@mantine/core';
import { getOrdersByQueryAPI, combinePOsAPI } from '../utils/apiUtils';
import { toast } from 'react-toastify';

interface AutoPOListPanelProps {
  currentPOId: string | undefined;
}

const AutoPOListPanel: React.FC<AutoPOListPanelProps> = ({ currentPOId }) => {
  const [autoPOs, setAutoPOs] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [combining, setCombining] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res: any = await getOrdersByQueryAPI({
        procurementSource: 'AUTO_PO_CREATION',
        isApproved: false,
      });
      setLoading(false);      
      if (res?.data?.orders) {
        setAutoPOs(res?.data?.orders || []);
      } else {
        toast.error('Failed to fetch auto POs');
      }
    })();
  }, []);

  const handleSelect = (poId: string) => {
    setSelected((prev) =>
      prev.includes(poId) ? prev.filter((id) => id !== poId) : [...prev, poId]
    );
  };

  const handleCombine = async () => {
    if (!currentPOId || selected.length === 0) {
      toast.error('Select at least one PO to link.');
      return;
    }
    setCombining(true);
    console.log('Combining POs:', currentPOId, selected);
    
    const res = await combinePOsAPI(currentPOId, selected);
    setCombining(false);
    if (res.success) {
      toast.success('POs combined successfully!');
      setSelected([]);
      setAutoPOs((prev) => prev.filter((po) => !selected.includes(po._id)));
    } else {
      toast.error(res.message || 'Failed to combine POs');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Text size="lg" weight={600} mb={10}>Unapproved Auto POs</Text>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th></th>
            <th>PO ID</th>
            <th>Dealer</th>
            <th>Items</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {autoPOs.length === 0 && (
            <tr><td colSpan={5}><Text>No auto POs found.</Text></td></tr>
          )}
          {autoPOs.map((po) => (
            <tr key={po._id}>
              <td>
                <Checkbox
                  checked={selected.includes(po._id)}
                  onChange={() => handleSelect(po._id)}
                  disabled={combining}
                />
              </td>
              <td>{po._id}</td>
              <td>{po.dealerName || '-'}</td>
              <td>{po.purchasedItems?.length || 0}</td>
              <td>{po.createdAt ? new Date(po.createdAt).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group mt={16}>
        <Button
          color="blue"
          onClick={handleCombine}
          loading={combining}
          disabled={true}
        >
          Link/Combine Selected to This PO
        </Button>
      </Group>
    </div>
  );
};

export default AutoPOListPanel; 