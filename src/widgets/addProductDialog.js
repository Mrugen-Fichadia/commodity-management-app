import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';

export default function AddProductDialog({ open, onClose, onProductAdded }) {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (res.ok) {
        onProductAdded();
    } else {
      alert('Failed to add product');
    }
  };

  return (
    <Dialog
  open={open}
  onClose={onClose}
  sx={{
    background: 'transparent',
    ...(document.body.classList.contains('dark') && {
      '& .MuiPaper-root': {
        background: '#000',
        color: '#fff',
      },
      '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': {
        color: '#ffffff',
      },
      '& .MuiInputBase-root': {
        color: '#ffffff',
      },
      '& .MuiInputLabel-root': {
        color: '#dddddd',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#444',
        },
        '&:hover fieldset': {
          borderColor: '#999',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#ffffff',
        },
      },
      '& .MuiBackdrop-root': {
        backgroundColor: 'transparent',
      },
    }),
  }}
>

      
      <DialogTitle sx={{
    color: document.body.classList.contains('dark') ? 'white' : 'black',
  }}>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="dense"
          onChange={handleChange}
              />
        <TextField
          label="Category"
          name="category"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />      
        <TextField
          label="Price"
          name="price"
          type="number"
          fullWidth
          margin="dense"
          onChange={handleChange}
              />
        <TextField
          label="Quantity"
          name="quantity"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          onChange={handleChange}
              />
        <TextField
          label="Image URL"
          name="image_url"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
