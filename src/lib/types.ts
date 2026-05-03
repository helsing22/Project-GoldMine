export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  popular: boolean;
  soldOut: boolean;
  imageUrl: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
  items: MenuItem[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
}

export interface ShiftInfo {
  staff: string;
  phone: string;
  qr: string;
  links: {
    zelle: string;
    paypal: string;
    visa: string;
  };
  qrUrl?: string;
}
