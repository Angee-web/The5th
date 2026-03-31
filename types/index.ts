export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "admin" | "customer";
  phone?: string;
  addresses: IAddress[];
  wishlist: string[];
  createdAt: string;
}

export interface IAddress {
  _id?: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  tags: string[];
  reviews: IReview[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface IReview {
  _id: string;
  user: { _id: string; name: string; image?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ICartItem {
  product: IProduct;
  size: string;
  color?: string;
  quantity: number;
}

export interface IOrder {
  _id: string;
  user: IUser;
  items: {
    product: IProduct;
    name: string;
    image: string;
    size: string;
    color?: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: IAddress;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentReference: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface IPromoCode {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  active: boolean;
}

export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  published: boolean;
  createdAt: string;
}

export interface IAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  topProducts: { product: IProduct; sales: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}
