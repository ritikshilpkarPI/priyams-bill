import { useEffect, useState } from 'react';
import Axios from 'axios';
import { Loader, Table, Text } from '@mantine/core';
import { Button } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';

const StockQuantity = () => {
  const [minimumQuantityItem, setMinimumQuantityItem] = useState([]);
  const [loader, setLoader] = useState(false);
  const [Id, setId] = useState('');
  const [modalToggle, setModalToggle] = useState(false);

  useEffect(() => {
    getAllItemsFeed();
  }, []);
  const getAllItemsFeed = async () => {
    setLoader(true);
    const fetch = await Axios.request({
      url: '/api/inventory/items',
      method: 'get',
      params: {
        filters: {
          minStockOnly: true,
          isDeleted: false,
        },
      },
      headers: {
        Cookie: '',
      },
    });
    const minStockItems = fetch.data.message.items;
    setMinimumQuantityItem(minStockItems);
    setLoader(false);
  };
  useEffect(() => {
    const openDeleteModal = () =>
      openConfirmModal({
        title: 'Remove your Item Permanently',
        centered: true,
        children: (
          <Text size="sm">
            Are you sure you want to remove your item permanently?
          </Text>
        ),
        labels: { confirm: 'Remove Item', cancel: "No don't remove it" },
        confirmProps: { color: 'red' },
        onCancel: () => {},
        onConfirm: () => {
          console.log('Confirmed');
          async function deletePost() {
            await Axios.delete(
              `/api/inventory/permanentlyOutOfStock/${Id}`
            ).then((response) => {
              getAllItemsFeed();
            });
          }
          deletePost();
        },
      });
    if (Id !== '') {
      openDeleteModal();
    }
  }, [Id, modalToggle]);

  const deleteItem = (index, id) => {
    setId(id);
    if (modalToggle) {
      setModalToggle(false);
    } else {
      setModalToggle(true);
    }
  };
  console.log(minimumQuantityItem);
  const rows = minimumQuantityItem.map((item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.itemName}</td>
      <td>{item.itemStockQuantity}</td>
      <td>{item.minimumStockQuantity}</td>
      <td>{item.itemMRPperUnit}</td>
      <td>{item.itemCostPricePerUnit}</td>
      <td>{item.itemSellingPricePerUnit}</td>
      {item.permanentlyOutOfStock ? <td>True</td> : <td>False</td>}
      <td>
        <Button color="red" onClick={() => deleteItem(index, item._id)}>
          Won't Order
        </Button>
      </td>
    </tr>
  ));
  return (
    <>
      {loader ? (
        <div
          style={{
            height: '95vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader size="xl" />
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <Text size="lg" weight="bold" align="center">
            Total Items: {minimumQuantityItem.length}
          </Text>

          <Table fontSize="lg" striped={true} style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>SR.No</th>
                <th>Item Name</th>
                <th>Current Stock</th>
                <th>Minimum Stock</th>
                <th>MRP/Unit</th>
                <th>Cost/Unit</th>
                <th>Selling Price/Unit</th>
                <th>Permanently Out of Stock</th>
                <th>Permanently Remove Item</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default StockQuantity;
