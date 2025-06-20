 "use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { useState } from "react";

const isValidAmazonProductURL = (url: string) => {
      try {
        const parseURL = new URL(url);
        const hostname = parseURL.hostname;

        if(
            hostname.includes('amazon.com') ||
            hostname.includes('amazon.') ||
            hostname.endsWith('amazon')
        ) {
            return true;
        }
        
      }catch (error) {
        return false;
      }
};

const Searchbar = () => {
 
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);
    
    // alert(isValidLink ? 'Valid link' : 'Invalid link');
    if (!isValidLink) return alert('Please provide a valid Amazon link');

    try {
          setIsLoading(true);
          

        //   Scrape the product page
        const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
        console.error(error);
    }finally {
        setIsLoading(false);
    }
  } 
  return (
    <form className="flex flex-wrap gap-4 mt-12"
      onSubmit={handleSubmit}
    >
        <input
         type="text"
         value={searchPrompt}
         onChange={(e) => setSearchPrompt(e.target.value)}
         placeholder="Enter product link"
         className="searchbar-input"
        />

        <button 
           type="submit" 
           className="searchbar-btn"
           disabled={searchPrompt === ''}
        >
            {isLoading ? 'Searching...' : 'Search'}
        </button>

    </form>
  )
}

export default Searchbar
