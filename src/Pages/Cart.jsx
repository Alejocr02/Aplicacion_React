
import { useEffect, useMemo, useState } from 'react';

import styles from './Cart.module.css';
import { loadProducts } from '../utils/productsStorage';
import { formatCOP } from '../utils/formatCOP';

const CART_STORAGE_KEY = 'cart';

const parseQuantity = (value) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
        return 1;
    }
    return parsed;
};

const normalizeItem = (item) => {
    if (!item || typeof item !== 'object') return null;

    const id = Number(item.id);
    if (!Number.isFinite(id)) return null;

    return {
        id,
        quantity: parseQuantity(item.quantity),
    };
};

const loadCart = () => {
    if (typeof window === 'undefined') return [];

    try {
        const stored = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];

        return parsed.map(normalizeItem).filter(Boolean);
    } catch {
        return [];
    }
};

function Cart() {
    const [products] = useState(loadProducts);
    const [cartItems, setCartItems] = useState(loadCart);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantityInput, setQuantityInput] = useState('1');

    const productsById = useMemo(() => {
        return new Map(products.map((product) => [product.id, product]));
    }, [products]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            void error;
        }
    }, [cartItems]);

    const rows = useMemo(() => {
        return cartItems
            .map((item) => {
                const product = productsById.get(item.id);
                if (!product) return null;

                const unitPrice = Number(product.price) || 0;
                const quantity = parseQuantity(item.quantity);
                const subtotal = unitPrice * quantity;

                return {
                    id: item.id,
                    quantity,
                    product,
                    unitPrice,
                    subtotal,
                };
            })
            .filter(Boolean);
    }, [cartItems, productsById]);

    const summary = useMemo(() => {
        return rows.reduce(
            (acc, row) => {
                acc.items += row.quantity;
                acc.total += row.subtotal;
                return acc;
            },
            { items: 0, total: 0 }
        );
    }, [rows]);

    const handleAddToCart = () => {
        const id = Number(selectedProductId);
        const quantity = parseQuantity(quantityInput);

        if (!Number.isFinite(id)) return;

        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === id);

            if (existing) {
                return prev.map((item) =>
                    item.id === id
                        ? {
                                ...item,
                                quantity: item.quantity + quantity,
                            }
                        : item
                );
            }

            return [...prev, { id, quantity }];
        });

        setQuantityInput('1');
    };

    const handleQuantityChange = (id, nextQuantity) => {
        const quantity = parseQuantity(nextQuantity);
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    const handleRemove = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleClear = () => {
        setCartItems([]);
    };

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Carrito de compras</h1>
                <p className={styles.subtitle}>Agrega productos, ajusta cantidades y revisa el total.</p>
            </header>

            <div className={styles.addPanel}>
                <div className={styles.fieldGroup}>
                    <label htmlFor="cart-product" className={styles.label}>
                        Producto
                    </label>
                    <select
                        id="cart-product"
                        className={styles.select}
                        value={selectedProductId}
                        onChange={(event) => setSelectedProductId(event.target.value)}
                    >
                        <option value="">Selecciona un producto</option>
                        {products.map((product) => (
                            <option key={product.id} value={String(product.id)}>
                                {product.name} - {formatCOP(product.price)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.fieldGroupSmall}>
                    <label htmlFor="cart-quantity" className={styles.label}>
                        Cantidad
                    </label>
                    <input
                        id="cart-quantity"
                        className={styles.input}
                        type="number"
                        min={1}
                        value={quantityInput}
                        onChange={(event) => setQuantityInput(event.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className={styles.btnAdd}
                    onClick={handleAddToCart}
                    disabled={!selectedProductId}
                >
                    Agregar al carrito
                </button>
            </div>

            {rows.length === 0 ? (
                <p className={styles.empty}>Tu carrito está vacío. Agrega tu primer producto arriba.</p>
            ) : (
                <div className={styles.layout}>
                    <ul className={styles.itemsList}>
                        {rows.map((row) => (
                            <li key={row.id} className={styles.itemCard}>
                                <img className={styles.itemImage} src={row.product.image} alt={row.product.name} />

                                <div className={styles.itemInfo}>
                                    <h2 className={styles.itemName}>{row.product.name}</h2>
                                    <p className={styles.itemCategory}>{row.product.category}</p>
                                    <p className={styles.itemPrice}>Precio unitario: {formatCOP(row.unitPrice)}</p>
                                </div>

                                <div className={styles.itemActions}>
                                    <label htmlFor={`qty-${row.id}`} className={styles.quantityLabel}>
                                        Cantidad
                                    </label>
                                    <input
                                        id={`qty-${row.id}`}
                                        className={styles.itemQty}
                                        type="number"
                                        min={1}
                                        value={row.quantity}
                                        onChange={(event) => handleQuantityChange(row.id, event.target.value)}
                                    />
                                    <p className={styles.itemSubtotal}>{formatCOP(row.subtotal)}</p>
                                    <button
                                        type="button"
                                        className={styles.btnRemove}
                                        onClick={() => handleRemove(row.id)}
                                    >
                                        Quitar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <aside className={styles.summary}>
                        <h2 className={styles.summaryTitle}>Resumen</h2>
                        <p className={styles.summaryRow}>Productos: {summary.items}</p>
                        <p className={styles.summaryTotal}>Total: {formatCOP(summary.total)}</p>

                        <button type="button" className={styles.btnClear} onClick={handleClear}>
                            Vaciar carrito
                        </button>
                        <button type="button" className={styles.btnCheckout}>
                            Finalizar compra
                        </button>
                    </aside>
                </div>
            )}
        </section>
    );
}

export default Cart;