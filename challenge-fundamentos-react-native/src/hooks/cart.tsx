import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const existingProducts = await AsyncStorage.getItem('@GoMarketplace');

      if (existingProducts) {
        setProducts([...JSON.parse(existingProducts)]);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    async function storeProducts(): Promise<void> {
      await AsyncStorage.setItem('@GoMarketplace', JSON.stringify(products));
    }
    storeProducts();
  }, [products]);

  const addToCart = useCallback(
    async product => {
      const existingProduct = products.findIndex(p => p.id === product.id);

      if (existingProduct >= 0) {
        const newProduct = products[existingProduct];
        setProducts(
          products.map(p =>
            p.id === newProduct.id
              ? { ...p, quantity: newProduct.quantity + 1 }
              : p,
          ),
        );
      } else {
        const newProduct = { ...product, quantity: 1 };
        setProducts([...products, newProduct]);
      }
    },
    [products],
  );
  const increment = useCallback(
    async id => {
      const incrementedProduct = products.findIndex(p => p.id === id);

      if (incrementedProduct >= 0) {
        const newProduct = products[incrementedProduct];
        setProducts(
          products.map(p =>
            p.id === newProduct.id
              ? { ...p, quantity: newProduct.quantity + 1 }
              : p,
          ),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const decrementedProduct = products.findIndex(p => p.id === id);

      if (decrementedProduct >= 0) {
        const newProduct = products[decrementedProduct];
        setProducts(
          products.map(p =>
            p.id === newProduct.id
              ? { ...p, quantity: newProduct.quantity - 1 }
              : p,
          ),
        );
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
