export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
}

export interface CardPrice {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
}

export interface Card {
  id: number;
  name: string;
  type: string;
  humanReadableCardType?: string;
  desc: string;
  race: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  card_images: CardImage[];
  card_prices?: CardPrice[];
}

export interface CardApiMeta {
  current_rows: number;
  total_rows: number;
  rows_remaining: number;
  total_pages: number;
  pages_remaining: number;
  next_page_offset: number;
}

export interface CardApiResponse {
  data: Card[];
  meta?: CardApiMeta;
}
