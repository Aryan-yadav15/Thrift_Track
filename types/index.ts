export type PriceHistoryItem = {
    date: string;
    price: number;
  };
  
  export type User = {
    email: string;
  };
  
  export type Product = {
    _id?: string;
    url: string;
    currency: string;
    image: string;
    title: string;
    currentPrice: number;
    originalPrice: number;
    priceHistory: PriceHistoryItem[] | [];
    highestPrice: number;
    lowestPrice: number;
    average: number;
    discountRate: number;
    description: string;
    reviewsCount: number;
    deliveryText: string;
    isOutOfStock: Boolean;
    users?: User[];
  };
  
  export type NotificationType =
    | "WELCOME"
    | "CHANGE_OF_STOCK"
    | "LOWEST_PRICE"
    | "THRESHOLD_MET";
  
  export type EmailContent = {
    subject: string;
    body: string;
  };
  
  export type EmailProductInfo = {
    title: string;
    url: string;
  };