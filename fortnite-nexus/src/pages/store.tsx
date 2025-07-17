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






function mapStoreData(storeData) {
  if (!storeData){
    return [];
  }

  return storeData.data?.entries.map(item =>({
    itemName: item.brItems && item.brItems.length > 0 ? item.brItems[0].name : "Unknown" ,
    ItemType: item.brItems && item.brItems.length > 0 ? item.brItems[0].type.displayValue : "Unknown",
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
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeItemList, setStoreItemList] = useState({
  emotes: [],
  outfits: [],
  wraps: [],
  backblings: [],
  gliders: [],
  pickaxe: [],
  loading: true
})


  function useStoreData() {
  

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
function StoreCategory({ title, items, loading }) {
  return (
    <div className="category-container">
      <h2 className='shop-category'>{title}</h2>
      {loading && <StoreSkeleton />}
      <div className="store-item-container">
        {items
          .filter(item => item.itemName !== "Unknown")
          .map((item, index) => (
            <div key={index} className="store-item">
              <h2>{item.itemName}</h2>
              <img className="item-Image" src={item.itemImage} alt={item.itemName} />
              <span>
                <p>Price: {item.itemPrice}</p>
                <img
                  style={{ height: "25px" }}
                  src="https://static.wikia.nocookie.net/fortnite/images/e/eb/V-Bucks_-_Icon_-_Fortnite.png"
                  alt="V-Bucks"
                />
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
function displayStore(storeDataToDisplay) {
  const categorized = {
    emotes: [],
    outfits: [],
    wraps: [],
    backblings: [],
    gliders: [],
    pickaxe: [],
    loading: true
  };
  storeDataToDisplay.map(item => {
    switch(item.ItemType){
      case "Emote":
        categorized.emotes.push(item);
        break;
      case "Outfit":
        categorized.outfits.push(item);
        break;
      case "Wrap":
        categorized.wraps.push(item);
        break;
      case "Back Bling":
        categorized.backblings.push(item);
        break;
      case "Glider":
        categorized.gliders.push(item);
        break;
      case "Pickaxe":
        categorized.pickaxe.push(item);
        break;
      default:
        break;
    }
  });
  setStoreItemList(categorized);
}

useEffect(() => {
    if (storeData) {
      displayStore(mapStoreData(storeData));
    }  
}, [storeData])


  const { loading: isLoading } = useStoreData();

  const categories = [
    { key: "emotes", label: "Emotes" },
    { key: "outfits", label: "Outfits" },
    { key: "backblings", label: "Backblings" },
    { key: "gliders", label: "Gliders" },
    { key: "wraps", label: "Wraps" },
  ];

  return (
    <>
      <div className="store-header">
        <h1>FortniteStore</h1>
      </div>
      {categories.map(cat => (
        <StoreCategory
          key={cat.key}
          title={cat.label}
          items={storeItemList[cat.key]}
          loading={isLoading}
        />
      ))}
    </>
  );
}