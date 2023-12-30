import axios from 'axios';
import cheerio from 'cheerio';
import { createConnection, Connection } from 'mysql2/promise';

interface ProductData {
  title: string;
  price: string;
  description: string;
 
}

const databaseConfig = {
  host: 'DESKTOP-8FKKR3P',
  user: 'mysql.sys',
  password: 'Shakshi2@5',
  database: 'items',
};

export async function scrapeAmazonProductAndStore(url: string): Promise<ProductData> {
  try {
    if (!url) {
      throw new Error('URL is required');
    }

   
    const response = await axios.get(url);

    
    const $ = cheerio.load(response.data);

    
    const title = $('#productTitle').text().trim();
    const price = $('#priceblock_ourprice').text().trim();
    const description = $('#productDescription').text().trim();

    
    const productData: ProductData = {
      title,
      price,
      description,
     
    };

    
    const connection: Connection = await createConnection(databaseConfig);

    
    await connection.execute(
      'INSERT INTO products (title, price, description) VALUES (?, ?, ?)',
      [productData.title, productData.price, productData.description]
    );

    
    await connection.end();

    
    return productData;
  } catch (error) {
    
    console.error('Error scraping and storing Amazon product:', error.message);
    throw error;
  }
}
