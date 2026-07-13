/**
 * Tipos que describen la forma de los datos que devuelve la API de YGOPRODeck.
 * Solo se modelan los campos que la aplicación realmente usa.
 * Doc: https://ygoprodeck.com/api-guide/
 */

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
  /** Descripción legible del tipo, ej. "Xyz Effect Monster". */
  humanReadableCardType?: string;
  /** Texto de efecto / descripción de la carta. */
  desc: string;
  race: string;
  /** Solo presente en cartas de tipo monstruo. */
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  card_images: CardImage[];
  card_prices?: CardPrice[];
}

/**
 * Metadatos de paginación que la API incluye cuando se piden `num`/`offset`.
 * Solo se usa `total_rows` (para calcular cuántas páginas hay en total).
 */
export interface CardApiMeta {
  current_rows: number;
  total_rows: number;
  rows_remaining: number;
  total_pages: number;
  pages_remaining: number;
  next_page_offset: number;
}

/** Respuesta exitosa de cardinfo.php. */
export interface CardApiResponse {
  data: Card[];
  meta?: CardApiMeta;
}
