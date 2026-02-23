import { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import { products } from '../data/Product';
import ProductCard from '../components/ProductCard';
import styles from './ProductList.module.css';

const STORAGE_KEY = "products";

function ProductList() {
    const [productsState, setProductsState] = useState(() => {
      if (typeof window === "undefined") {
        return products;
      }
    
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return products;
      }
    
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : products;
      } catch {
        return products;
      }
    });

    useEffect(() => {
      if (typeof window === "undefined") {
        return;
      }
    
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productsState));
      } catch (error) {
        void error;
      }
    }, [productsState]);


    const handleAddProduct = (product) => {
        setProductsState((prev) => {
            const maxId = prev.reduce((acc, item) => Math.max(acc, item.id), 0);
            const nextId = maxId + 1;
            handleCloseForm();
            return [...prev, { ...product, id: nextId }];
        });
    };

    const handleDeleteProduct = (id) => {
  setProductsState((prev) => prev.filter((product) => product.id !== id));
};

const [editingProduct, setEditingProduct] = useState(null);

const handleEditStart = (product) => {
  setEditingProduct(product);
  setIsFormOpen(true);
};

const handleEditCancel = () => {
  setEditingProduct(null);
};

const handleEditSubmit = (updatedProduct) => {
  setProductsState((prev) =>
    prev.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product,
    ),
  );
  handleCloseForm();
  setEditingProduct(null);
};

const handleOpenCreate = () => {
  setEditingProduct(null);
  setIsFormOpen(true);
};

const handleCloseForm = () => {
  setEditingProduct(null);
  setIsFormOpen(false);
};

const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Productos informaticos</h1>
                <p className={styles.subtitle}>
                    Encuentra los mejores productos de tecnologia pra tu setup
                </p>
            </header>
            {isFormOpen ? (
                <ProductForm
                    initialValues={editingProduct}
                    isEditing={Boolean(editingProduct)}
                    onCancel={handleCloseForm}
                    onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
                />
            ) : (
                <>
                    <div className={styles.toolbar}>
                        <button
                            className={styles.btnAdd}
                            type="button"
                            onClick={handleOpenCreate}
                        >
                            Agregar producto
                        </button>
                    </div>

                    <div className={styles.grid}>
                        {productsState.map((product) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                category={product.category}
                                price={product.price}
                                stock={product.stock}
                                image={product.image}
                                description={product.description}
                                onDelete={() => handleDeleteProduct(product.id)}
                                onEdit={() => handleEditStart(product)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}




export default ProductList;