import { Cheerio } from "cheerio"
import axios from 'axios'
import * as cheerio from 'cheerio'
import { extractDescription, extractPrice } from "../utils"


export async function scrapeAmazonProduct(url: string){
    if(!url) return

    try {
        const response= await axios.get(url)
        const $ = cheerio.load(response.data)

        const title = $('#productTitle').text().trim()
        //console.log({title})

        const currentPrice=extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base')
        )
        
        const deliveryInfo = $('span[data-csa-c-type="element"][data-csa-c-content-id="DEXUnifiedCXPDM"]');
        let deliveryText = '';
        
        if (deliveryInfo.length > 0) {
            deliveryText = deliveryInfo.text().trim();
        } else {
            console.log('Delivery information not found.');
        }

        const reviewsCountElement = $('#acrCustomerReviewText'); // Select the element with ID acrCustomerReviewText

        // Extract the text content if the element exists
        let reviewsCountValue = '';
        if (reviewsCountElement.length > 0) {
            reviewsCountValue = reviewsCountElement.text().trim(); // Get the text content and remove leading/trailing spaces
        
            // Remove non-numeric characters (like commas) from the string to extract only the number
            reviewsCountValue = reviewsCountValue.replace(/\D/g, ''); // Replace non-digits with an empty string
        }

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('.a-size-base.a-color-price')
        )        


        const outOfStock = $('span.a-color-price.a-text-bold').text().trim().toLowerCase() === 'currently unavailable.';

        const images=
        $('#imgBLKFront').attr('data-a-dynamic-image')||
        $('#landingImage').attr('data-a-dynamic-image')||
        '{}'
        // idk how this works but works 

        const imageUrls= Object.keys(JSON.parse(images))

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g,"")

        // console.log({currentPrice, originalPrice, outOfStock, imageUrls,discountRate})
        // transfer all the data to a data object 

        const description =  extractDescription($)
        const reviewsCount = parseInt(reviewsCountValue, 10);

        const data={
            url,
            currency: '₹',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(originalPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            reviewsCount,
            isOutOfStock: outOfStock,
            deliveryText,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            average: Number(currentPrice) || Number(originalPrice)
            
        }
        //console.log(data)
        return data
    } catch (error:any) {
        throw new Error(`failed to scrape the data : ${error.message}`)
    }
}