"use server"
import nodemailer from 'nodemailer';
import Product from '../models/product.model';
import { EmailContent } from '@/types';


const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
} as const;

type NotificationType = keyof typeof Notification;

interface EmailProductInfo {
    title: string;
    url: string;
    currentPrice: number;
    lowestPrice: number;
    isOutOfStock: boolean;
}

export async function generateEmailBody(
    product: EmailProductInfo,
    type: NotificationType
) {
  const THRESHOLD_PERCENTAGE = 40;
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = '';
  let body = '';

  switch (type) {
    case Notification.WELCOME:
      subject = 'Welcome to Price Tracker!';
      body = `
        <h1>👋 Welcome!</h1>
        <p>Thank you for subscribing to track <strong>${product.title}</strong>.</p>
        <p>We'll notify you when the price drops or the product is back in stock.</p>
        <a href="${product.url}">View Product</a>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is back in stock!`;
      body = `
        <h1>✅ Back In Stock!</h1>
        <p>Good news! The product <strong>${product.title}</strong> is now available.</p>
        <p>Current Price: ₹${product.currentPrice}</p>
        <a href="${product.url}">Buy Now</a>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `🎯 Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <h1>📉 Lowest Price!</h1>
        <p><strong>${product.title}</strong> has dropped to its lowest price yet.</p>
        <p>Current Price: ₹${product.currentPrice}</p>
        <p>Lowest Recorded Price: ₹${product.lowestPrice}</p>
        <a href="${product.url}">Check it Out</a>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `🔔 Price Drop Alert for ${shortenedTitle}`;
      body = `
        <h1>📢 Deal Alert!</h1>
        <p>The price for <strong>${product.title}</strong> has dropped below your desired threshold.</p>
        <p>Current Price: ₹${product.currentPrice}</p>
        <a href="${product.url}">View Deal</a>
      `;
      break;

    default:
      throw new Error('Invalid notification type.');
  }

  return { subject, body };
};


// const transporter = nodemailer.createTransport({
//   host: 'localhost',
//   port: 1025,
//   secure: false, // No TLS
// });

const transporter = nodemailer.createTransport({
    pool: true,
    service: 'gmail',
    // port: 1026,
    auth: {
        user: '23f2004577@ds.study.iitm.ac.in',
        pass: process.env.EMAIL_PASSWORD,
    },
    maxConnections: 1
})

export const sendEmail = async (emailContent: EmailContent,sendTo: string[]) => {
    const mailOptions = {
        from : 'Price Tracker <vivekanandkumawat266@gmail.com>',
        to: sendTo,
        html: emailContent.body,
        subject: emailContent.subject,
    }

    console.log("⏳ Sending email to:", sendTo.join(", "));
    console.log("📧 Subject:", emailContent.subject);


    transporter.sendMail(mailOptions, (error: any, info: any) => {
           if (error) {
                console.error("❌ Failed to send email:", error);
            } else {
                console.log("✅ Email sent successfully!");
                console.log("📨 Message Info:", info.response);
    }
    })
}