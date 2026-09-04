import { create } from 'zustand';

export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutState {
  items: CheckoutItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  address: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  setAddress: (address: Partial<CheckoutState['address']>) => void;
  setContact: (contact: Partial<CheckoutState['contact']>) => void;
  setItems: (items: CheckoutItem[]) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  // Mock data for demonstration purposes as Shopping Cart should not be modified
  items: [
    { id: '1', name: 'Premium Wireless Headphones', price: 299, quantity: 1 },
    { id: '2', name: 'Ergonomic Desk Chair', price: 199, quantity: 2 },
  ],
  subtotal: 697,
  tax: 69.7,
  shipping: 0,
  discount: 50,
  total: 716.7,
  address: {
    fullName: 'John Doe',
    streetAddress: '123 AI Avenue',
    city: 'Techville',
    state: 'CA',
    zipCode: '90210',
    country: 'USA',
  },
  contact: {
    email: 'john.doe@example.com',
    phone: '+1 555-123-4567',
  },
  setAddress: (address) =>
    set((state) => ({ address: { ...state.address, ...address } })),
  setContact: (contact) =>
    set((state) => ({ contact: { ...state.contact, ...contact } })),
  setItems: (items) => 
    set((state) => {
      const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax + state.shipping - state.discount;
      return { items, subtotal, tax, total };
    }),
}));
