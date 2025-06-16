"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowerPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    await connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapedProduct) return;

    let product = {
      ...scrapedProduct,
      priceHistory: [{ price: scrapedProduct.currentPrice }],
      lowerPrice: scrapedProduct.currentPrice,
      highestPrice: scrapedProduct.currentPrice,
      averagePrice: scrapedProduct.currentPrice
    };

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowerPrice: getLowerPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory)
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    await connectToDB();

    const product = await Product.findOne({ _id: productId });
    return product || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllProducts() {
  try {
    await connectToDB();

    const products = await Product.find();
    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    await connectToDB();

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId }
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
    return null;
  }
}


export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
      const product = await Product.findById(productId);

      if(!product) return;

      const userExists = product.users.some((user: User) => user.email === userEmail);

      if(!userExists) {
        product.users.push({ email: userEmail});

        await product.save();

        const emailContent = await generateEmailBody(product, "WELCOME");

        await sendEmail(emailContent, [userEmail]);
          
      }
  } catch(error) {
    console.log(error)
  }

}

// "use server"

// import { revalidatePath } from "next/cache";
// import Product from "../models/product.model";
// import { connectToDB } from "../mongoose";
// import { scrapeAmazonProduct } from "../scraper";

// import { getAveragePrice, getHighestPrice, getLowerPrice } from "../utils";

// export async function scrapeAndStoreProduct(productUrl: string) {
//    if (!productUrl) return;
   
//    try {
//      await connectToDB();

//      const scrapedProduct = await scrapeAmazonProduct(productUrl);

//      if (!scrapedProduct) return ;

//     //  let product = scrapedProduct;
    
//     let product = {
//       ...scrapedProduct,
//       priceHistory: [{ price: scrapedProduct.currentPrice }],
//       lowerPrice: scrapedProduct.currentPrice,
//       highestPrice: scrapedProduct.currentPrice,
//       averagePrice: scrapedProduct.currentPrice
//      };


//      const existingProduct = await Product.findOne({ url: scrapedProduct.url });
     
//      if (existingProduct) {
//         const updatedPriceHistory = [
//           ...existingProduct.priceHistory,
//           {price: scrapedProduct.currentPrice }
//         ]

//         product = {
//           ...scrapedProduct,
//           priceHistory: updatedPriceHistory,
//           lowerPrice: getLowerPrice(updatedPriceHistory), 
//           highestPrice: getHighestPrice(updatedPriceHistory),
//           averagePrice: getAveragePrice(updatedPriceHistory),
//         }
//      }
     
//      const newProduct = await Product.findOneAndUpdate(
//         {url: scrapedProduct.url },
//         product,
//         { upsert: true, new: true }
//      )

//      revalidatePath(`/products/${newProduct._id}`);

//    } catch (error: any) {
//      throw new Error(`Failed to create/update product: ${error.message}`)
//    }
// }


// export async function getProductById(productId: string) {
//   try {
//     connectToDB();

//     const product = await Product.findOne({ _id: productId});

//     if(!product) return null;

//     return product;

//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function getAllProducts() {
//   try{
//     connectToDB();

//     const products = await Product.find();

//     return products;
//   } catch (error) {
//     console.log(error)
//   }
// }


// export async function getSimilarProducts() {
//   try{
//     connectToDB();

//     const currentProduct = await Product.findById(productId);

//     if (!currentProduct) return null;

//     const similarProducts = await Product.find({
//        _id: { $ne: productId }
//     }).limit(3);

//     const products = await Product.find();

//     return similarProducts;
//   } catch (error) {
//     console.log(error)
//   }
// }

 