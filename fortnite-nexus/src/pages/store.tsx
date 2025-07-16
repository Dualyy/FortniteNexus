import axios from 'axios';
import { use, useEffect, useState } from 'react';
import './store.css';

const server = {
  API_KEY: import.meta.env.VITE_API_KEY, // Use the environment variable or fallback to a default value
  BASE_URL: 'https://fortnite-api.com/v2/shop'
};

function fetchStoreData(){
  try{
    return axios.get(server.BASE_URL)
  }
  catch(error){
    console.error(error);
    return null
  }
}

function useStoreData() {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStoreData();
        if (response && response.data) {
          setStoreData(response.data);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { storeData, loading };
}

function mapStoreData(storeData) {
  if (!storeData){
    return [];
  }

  return storeData.data?.entries.map(item =>({
    itemName: item.brItems && item.brItems.length > 0 ? item.brItems[0].name : "Unknown" ,
    itemImage: item.newDisplayAsset?.renderImages[0].image,
    itemPrice: item.finalPrice}));
}

function StoreSkeleton() {
  return (
    <div className="store-item-container">
      {[...Array(20)].map((_, idx) => (
        <div className="skeleton-store-item" key={idx}>
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-price"></div>
        </div>
      ))}
    </div>
  );
}


export function Store() {
  return (
    <>
    <div className='store-header'>
      <h1>FortniteStore</h1>
      </div>
      {useStoreData().loading && <StoreSkeleton />}
      <div className='store-item-container'>
      {console.log(useStoreData())}
      {mapStoreData(useStoreData().storeData).map((item, index) => {if(item.itemName !== "Unknown")
        return (
          
            <div key={index} className="store-item">
              <h2>{item.itemName}</h2>
              <img className='item-Image' src={item.itemImage} alt={item.itemName} />
              <span><p>Price: {item.itemPrice}</p> <img style={{height: '25px'}} src='https://static.wikia.nocookie.net/fortnite/images/e/eb/V-Bucks_-_Icon_-_Fortnite.png'/> </span>
            </div>
          
        );
      })}
      </div>
    </>
  )
}