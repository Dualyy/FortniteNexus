import React from 'react';
import './store.css';
import { useStoreData } from '../hooks/useStoreData';
import { StoreItem } from '../services/fortniteApi';
import { STORE_CATEGORIES, VBUCKS_ICON_URL, SKELETON_ITEM_COUNT } from '../utils/constants';

function StoreSkeleton() {
  return (
    <div className="store-item-container">
      {[...Array(SKELETON_ITEM_COUNT)].map((_, idx) => (
        <div className="skeleton-store-item" key={idx}>
          <div className="skeleton-text"></div>
          <div className="skeleton-image"></div>
          <div className="skeleton-price"></div>
        </div>
      ))}
    </div>
  );
}

interface StoreCategoryProps {
  title: string;
  items: StoreItem[];
  loading: boolean;
}

function StoreCategory({ title, items, loading }: StoreCategoryProps) {
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
                  src={VBUCKS_ICON_URL}
                  alt="V-Bucks"
                />
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export function Store() {
  const { categorizedStore, loading } = useStoreData();

  return (
    <>
      <div className="store-header">
        <h1>FortniteStore</h1>
      </div>
      {STORE_CATEGORIES.map(cat => (
        <StoreCategory
          key={cat.key}
          title={cat.label}
          items={categorizedStore[cat.key as keyof typeof categorizedStore]}
          loading={loading}
        />
      ))}
    </>
  );
}