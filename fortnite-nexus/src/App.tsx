import React, { useState, useEffect } from 'react';
import './App.css'
import { useTheme } from './ThemeContext';
import PlayerOverview from './components/PlayerOverview';
import { useFortniteStats } from './hooks/useFortniteStats';
import { useProfileImages } from './hooks/useProfileImages';
import { UserDataType } from './types/UserDataType';
import { sanitizeUsername } from './utils/formatters';

function App() {
  const { isDarkMode } = useTheme();
  const {
    userData,
    user,
    compare,
    compareUser,
    kdData,
    winrateData,
    winData,
    handleFormSubmit,
    deleteUser,
    deleteCompareUser
  } = useFortniteStats();

  const { profileImages, getRandomImage } = useProfileImages(userData, compare);
  const [enhancedUserData, setEnhancedUserData] = useState<UserDataType | null>(null);
  const [enhancedCompare, setEnhancedCompare] = useState<UserDataType | null>(null);

  // Handle profile image assignment for main user
  useEffect(() => {
    if (userData && !userData.image && profileImages.length > 0) {
      const randomImage = getRandomImage();
      if (randomImage) {
        setEnhancedUserData({ ...userData, image: randomImage });
      }
    } else {
      setEnhancedUserData(userData);
    }
  }, [userData, profileImages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle profile image assignment for comparison user
  useEffect(() => {
    if (compare && !compare.image && profileImages.length > 0) {
      const randomImage = getRandomImage(enhancedUserData?.image || undefined);
      if (randomImage) {
        setEnhancedCompare({ ...compare, image: randomImage });
      }
    } else {
      setEnhancedCompare(compare);
    }
  }, [compare, profileImages, enhancedUserData?.image]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ensure two users don't have the same profile image
  useEffect(() => {
    if (
      enhancedUserData?.image &&
      enhancedCompare?.image &&
      enhancedUserData.image === enhancedCompare.image &&
      profileImages.length > 1
    ) {
      const newImage = getRandomImage(enhancedUserData.image);
      if (newImage) {
        setEnhancedCompare(prev => prev ? { ...prev, image: newImage } : null);
      }
    }
  }, [enhancedUserData?.image, enhancedCompare?.image, profileImages]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className={`Main-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className={`main-page-header-container ${enhancedUserData ? 'content-loaded' : ''}`}>
          <h1 className={'main-page-header'}>Fortnite<span className={'nexus'}>Nexus</span></h1>
          <p>Get your Fortnite stats in one place!</p>
          <p>Search for your Fortnite stats by username.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              let searchValue = formData.get('search') as string;
              if (searchValue !== null) {
                searchValue = sanitizeUsername(searchValue);
                console.log(searchValue)
                formData.set('search', searchValue);
              }

              const result = await handleFormSubmit(formData);
              if (!result.success) {
                alert(result.error);
              }
            }}
          >
            <input className={`searchInput ${isDarkMode ? 'dark-mode' : ''}`} type="text" placeholder="Search.." name="search"/>
            <input className='compare' type='checkbox' id="compare" name="compare"/>
            <label htmlFor="compare">Compare</label>
          </form>
        </div>
        {enhancedUserData && (
          <PlayerOverview
            user={user}
            userData={enhancedUserData}
            compare={enhancedCompare}
            compareUser={compareUser}
            kdData={kdData}
            winrateData={winrateData}
            winData={winData}
            isDarkMode={isDarkMode}
            deleteUser={deleteUser}
            deleteCompareUser={deleteCompareUser}
          />
        )}
      </div>
    </>
  )
}

export default App