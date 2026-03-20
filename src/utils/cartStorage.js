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

export function addToCart(id, quantity = 1) {
  const cur = readCart();
  const idx = cur.findIndex((it) => it.id === id);
  if (idx === -1) {
    cur.push({ id, quantity });
  } else {
    cur[idx].quantity = Math.max(1, Number(cur[idx].quantity || 0) + Number(quantity || 0));
  }
  writeCart(cur);
  return cur;
}

export function removeFromCart(id) {
  const cur = readCart().filter((it) => it.id !== id);
  writeCart(cur);
  return cur;
}

export function clearCart() {
  writeCart([]);
}

export function getCart() {
  return readCart();
}

export default {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
};