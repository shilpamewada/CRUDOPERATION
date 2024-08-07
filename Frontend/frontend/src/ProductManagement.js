import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({ name: '', price: '', description: '' });
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5000/products');
    console.log('Products Retrieved:', response.data); 
    setProducts(response.data);
  };

  const createProduct = async () => {
    const response = await axios.post('http://localhost:5000/products', product);
    console.log('Product Created:', response.data); 
    fetchProducts();
  };

  const updateProduct = async () => {
    if (editingProductId) {
      const response = await axios.put(`http://localhost:5000/products/${editingProductId}`, product);
      console.log('Product Updated:', response.data); 
      setEditingProductId(null);
      fetchProducts();
    }
  };

  const deleteProduct = async (id) => {
    const response = await axios.delete(`http://localhost:5000/products/${id}`);
    console.log('Product Deleted:', response.data); 
    fetchProducts();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    console.log('Input Changed:', { name, value }); 
  };

  const startEditing = (product) => {
    setProduct(product);
    setEditingProductId(product._id);
  };

  return (
    <div>
      <h1>Product Management</h1>
      <input name="name" placeholder="Name" value={product.name} onChange={handleChange} />
      <input name="price" placeholder="Price" value={product.price} onChange={handleChange} />
      <input name="description" placeholder="Description" value={product.description} onChange={handleChange} />
      {editingProductId ? (
        <button onClick={updateProduct}>Update Product</button>
      ) : (
        <button onClick={createProduct}>Add Product</button>
      )}

      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.price} - {product.description}
            <button onClick={() => startEditing(product)}>Edit</button>
            <button onClick={() => deleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
