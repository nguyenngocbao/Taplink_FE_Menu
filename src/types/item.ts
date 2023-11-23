export type ItemRequest = {
  id?: string;
  image: string;
  category: string;
  name: string;
  priceType: string;
  prices: string[];
};

export type ItemReponse = ItemRequest;
