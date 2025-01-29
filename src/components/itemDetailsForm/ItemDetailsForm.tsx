import React, { useState } from 'react';
import {
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Container,
} from '@mantine/core';
// import './ItemDetailsForm.css';

interface Item {
  name: string;
  quantity: number;
  price: number;
  description: string;
}

export const ItemDetailsForm = () => {
  const [formData, setFormData] = useState<Item>({
    name: '',
    quantity: 1,
    price: 0,
    description: '',
  });

  const [items, setItems] = useState<Item[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    setItems([...items, formData]);
    setFormData({ name: '', quantity: 1, price: 0, description: '' }); 
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmitItems = () => {
    console.log('Submitting items:', items);
    alert('Items submitted!');
    setItems([]); 
  };

  return (
    <div className="item-details-form">
      <Container>
        <form>
          <Stack spacing="md">
            <TextInput
              label="Item Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <NumberInput
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={(val) =>
                setFormData({ ...formData, quantity: val || 1 })
              }
              min={1}
              required
            />

            <NumberInput
              label="Price"
              name="price"
              value={formData.price}
              onChange={(val) => setFormData({ ...formData, price: val || 0 })}
              min={0}
              required
            />

            <TextInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <Button onClick={handleAddItem} type="button">
              Add Item
            </Button>
          </Stack>
        </form>

        <div className="added-items">
          <h3>Added Items</h3>
          {items.length > 0 ? (
            <ul>
              {items.map((item, index) => (
                <li key={index} className="item">
                  <div>
                    <strong>Name:</strong> {item.name}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {item.quantity}
                  </div>
                  <div>
                    <strong>Price:</strong> ${item.price}
                  </div>
                  <div>
                    <strong>Description:</strong> {item.description}
                  </div>
                  <Button
                    color="red"
                    onClick={() => handleDeleteItem(index)}
                    size="xs"
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items added yet.</p>
          )}
        </div>

        {items.length > 0 && (
          <Group position="right" mt="md">
            <Button color="green" onClick={handleSubmitItems}>
              Submit All Items
            </Button>
          </Group>
        )}
      </Container>
    </div>
  );
};
