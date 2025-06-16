import { PriceHistoryItem } from "@/types";
import { CheerioAPI } from 'cheerio';
import * as cheerio from 'cheerio';
 
import { Product } from "@/types";
const THRESHOLD_PERCENTAGE = 40;

const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
}

export function extractOriginalPrice($: cheerio.CheerioAPI): string {
  // Try different selectors Amazon commonly uses
  const selectors = [
    '#priceblock_ourprice',                                     // Standard old price ID
    '#listPrice',                                               // List price ID
    '#priceblock_dealprice',                                    // Deal price ID
    '.a-price.a-text-price span.a-offscreen',                  // Used for discounted original price
    '.a-text-price span',                                       // Generic fallback
    '.a-size-base.a-color-price',                               // Rare fallback
  ];

  for (const selector of selectors) {
    const price = $(selector).first().text().trim();
    if (price) return price;
  }

  return '';
}


//  Extracts and returns the price from a List of possible elements.
export function extractPrice(...elements:any) {
   for (const element of elements) {
      const priceText = element.text().trim();

      if(priceText) {
         const cleanPrice = priceText.replace(/[^\d.]/g, '');
         console.log({cleanPrice})

         let firstPrice;

         if (cleanPrice) {
            firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
         }

         return firstPrice || cleanPrice;
      }
   }

   return '';
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
   const currencyText = element.text().trim().slice(0, 1);
   return currencyText ? currencyText : "";
}

// Extracts description from two possible elements from amazon
export function extractDescription($: CheerioAPI): string {
  let desc = $('#productDescription').text().trim();
  if (desc) return desc;

  // Fallback: grab bullet features if main description is missing
  const bullets = $('#feature-bullets ul li span')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean)
    .join('\n');

  if (bullets) return bullets;

  return 'No description available';
}

// export function extractDescription($: any) {
//    // these are possible elements holding description of the product
//    const selectors = [
//       ".a-unordered-list .a-list-item",
//       ".a-expander-content p",
//       // Add more selectors here if neeeded
//    ];

//    for (const selector of selectors) {
//       const elements = $(selector);
//       if (elements.length > 0) {
//          const textContent = elements
//            .map((_: any, element: any) => $(element).text().trim())
//            .get()
//            .join("\n");
//            return textContent;
//       }
//    }
// }


export function getHighestPrice(priceList: PriceHistoryItem[]) {
   let highestPrice = priceList[0];
   for (let i= 0; i<priceList.length; i++) {
      if (priceList[i].price > highestPrice.price) {
         highestPrice = priceList[i];
      }
   }

   return highestPrice.price;
}


export function getLowerPrice(priceList: PriceHistoryItem[]) {
   let lowestPrice = priceList[0];

   for (let i = 0; i < priceList.length; i++) {
      if (priceList[i].price < lowestPrice.price) {
         lowestPrice = priceList[i];
      }
   }

   return lowestPrice.price;
}


export function getAveragePrice(priceList: PriceHistoryItem[]) {
   const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);

   const averagePrice = sumOfPrices / priceList.length || 0;

   return averagePrice;
}


export const getEmailNotifType = (
   scrapedProduct: Product,
   currentProduct: Product
) => {
   const lowestPrice = getLowerPrice(currentProduct.priceHistory);

   if (scrapedProduct.currentPrice < lowestPrice) {
      return Notification.LOWEST_PRICE  as keyof typeof Notification;
   }

   if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
      return Notification.CHANGE_OF_STOCK  as keyof typeof Notification;
   }

   if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
      return Notification.THRESHOLD_MET  as keyof typeof Notification;
   }

   return null;
};

export const formatNumber = (num: number)  => {
   if(typeof num !== 'number') return 0;

   return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits:0,
   });
};

// export function extractPrice(...elements: any){
//      for (const element of elements){
//         const priceText = element.text().trim();

//         if(priceText) return priceText.replace(/\D/g, '');

//      }

//      return '';
// }


// export function extractCurrency(element: any) {
//    const currencyText = element.text().trim().slice(0, 1);
//    return currencyText ? currencyText : '';
// }