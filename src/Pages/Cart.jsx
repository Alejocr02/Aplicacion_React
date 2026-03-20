
import { useEffect, useMemo, useState } from 'react';
import styles from './Cart.module.css';
import { loadProducts } from '../utils/productsStorage';

const CART_KEY = 'cart_items';

function readCart() {
    try {
        const raw = window.localStorage.getItem(CART_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeCart(items) {
    try {
        window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
        // ignore
    }
}

function formatCurrency(value) {
    try {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    } catch {
        return String(value);
    }
}

function Cart() {
    const [cart, setCart] = useState(() => {
        if (typeof window === 'undefined') return [];
        return readCart();
    });

    const products = useMemo(() => loadProducts(), []);

    useEffect(() => {
        writeCart(cart);
    }, [cart]);

    const items = cart
        .map((entry) => ({ ...entry, product: products.find((p) => p.id === entry.id) }))
        .filter((it) => it.product);

    const total = items.reduce((s, it) => s + (Number(it.product.price) || 0) * (Number(it.quantity) || 0), 0);

    const updateQuantity = (id, next) => {
        setCart((cur) => cur.map((e) => (e.id === id ? { ...e, quantity: Math.max(1, next) } : e)));
    };

    const removeItem = (id) => {
        setCart((cur) => cur.filter((e) => e.id !== id));
    };

    const clearCart = () => setCart([]);

    return (
        <section className={styles.cart}>
            <h1 className={styles.title}>Carrito de Compras</h1>

            {items.length === 0 ? (
                <div className={styles.empty}>
                    <p>No tienes productos en el carrito.</p>
                </div>
            ) : (
                <>
                    <ul className={styles.items}>
                        {items.map(({ id, quantity, product }) => (
                            <li key={id} className={styles.item}>
                                <img src={product.image} alt={product.name} className={styles.image} />
                                <div className={styles.info}>
                                    <h3 className={styles.name}>{product.name}</h3>
                                    <p className={styles.price}>{formatCurrency(product.price)}</p>
                                    <div className={styles.controls}>
                                        <button className={styles.btn} onClick={() => updateQuantity(id, Number(quantity) - 1)}>-</button>
                                        <span className={styles.qty}>{quantity}</span>
                                        <button className={styles.btn} onClick={() => updateQuantity(id, Number(quantity) + 1)}>+</button>
                                        <button className={styles.btnRemove} onClick={() => removeItem(id)}>Eliminar</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <footer className={styles.footer}>
                        <div className={styles.summary}>
                            <span>Total:</span>
                            <strong className={styles.total}>{formatCurrency(total)}</strong>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.btnSecondary} onClick={clearCart}>Vaciar carrito</button>
                            <button className={styles.btnPrimary} onClick={() => alert('Simulación de pago — implementar proceso de checkout')}>Pagar</button>
                        </div>
                    </footer>
                </>
            )}
        </section>
    );
}

export default Cart;