import { useEffect, useState } from 'react';
import { Loader, Table, Text } from '@mantine/core';
import { Button } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { Pagination } from '../components/pagination/paginations';

const StockQuantity = () => {
  const [minimumQuantityItem, setMinimumQuantityItem] = useState([]);
  const [loader, setLoader] = useState(false);
  const [Id, setId] = useState('');
  const [modalToggle, setModalToggle] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(200);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const totalPages = totalItemsCount ? Math.ceil(totalItemsCount / limitPage) - 1 : 0;
  const paginationArrLength = 8;

  const [paginationIndices, setPaginationIndices] = useState([]);
  const skip = limitPage*(currentPage-1);


  const paginationArr = (length)=> {
    let arr = [], startElem = 2;
    for (let i = 0; i < length; i++) { 
      arr[i]=startElem++;
    }
    setPaginationIndices(arr);
  }

  useEffect(() => {
    getAllItemsFeed();
  }, [currentPage]);
  const getAllItemsFeed = async () => {
    setLoader(true);
    const fetch = await genericAxios({
      url: API_PATHS.INVENTORY.GET_ITEMS,
      method: API_METHODS.GET,
      params: {
        filters: {
          minStockOnly: true,
          isDeleted: false,
          skip,
          limit: limitPage
        },
      },
      headers: {
        Cookie: '',
      },
    });
    if (fetch.error) return;
    const minStockItems = fetch.data.message.items;
    setMinimumQuantityItem(minStockItems);
    const itemCount = fetch?.data?.message?.itemCount??0;
    setTotalItemsCount(itemCount)
    setLoader(false);
  };
  useEffect(()=>{
    const length = totalPages > paginationArrLength ? paginationArrLength - 2 : totalPages - 2;
      !paginationIndices.length && paginationArr(length)
  },[totalItemsCount])
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
          async function deletePost() {
            await genericAxios({
              url: `${API_PATHS.INVENTORY.GET_PERMANENTLY_OUT_OF_STOCK}/${Id}`,
            }).then((response) => {
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
            <Pagination  currentPage={currentPage} totalPages={totalPages} paginationIndices={paginationIndices} setCurrentPage={setCurrentPage} setPaginationIndices={ setPaginationIndices } className={"inventory-pagination"}/>
          </Table>
        </div>
      )}
    </>
  );
};

export default StockQuantity;
