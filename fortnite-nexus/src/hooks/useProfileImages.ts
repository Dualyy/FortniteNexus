import { useState, useEffect, useCallback } from 'react';
import { fortniteApi } from '../services/fortniteApi';
import { UserDataType } from '../types/UserDataType';

export function useProfileImages(userData: UserDataType | null, compare: UserDataType | null) {
  const [profileImages, setProfileImages] = useState<string[]>([]);

  // Fetch profile images on mount
  useEffect(() => {
    const loadProfileImages = async () => {
      const images = await fortniteApi.getCosmeticsData();
      setProfileImages(images);
    };

    loadProfileImages();
  }, []);

  const getRandomImage = useCallback((excludeImage?: string): string | null => {
    if (profileImages.length === 0) return null;

    if (excludeImage && profileImages.length > 1) {
      let newImage;
      do {
        newImage = profileImages[Math.floor(Math.random() * profileImages.length)];
      } while (newImage === excludeImage);
      return newImage;
    }

    return profileImages[Math.floor(Math.random() * profileImages.length)];
  }, [profileImages]);

  return {
    profileImages,
    getRandomImage
  };
}