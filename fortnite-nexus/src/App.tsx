import React, { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios';
import { useTheme } from './ThemeContext';
import PlayerOverview from './components/PlayerOverview';

// import{ UserDataType } from './types/UserDataType'; // Type definition is now in this file.

// Define the types for the Fortnite stats data
interface StatsDetail {
  wins: number;
  matches: number;
  kills: number;
  kd: number;
  winRate: number;
  lastModified: string;
}

interface AllStats {
  overall: StatsDetail;
  solo: StatsDetail;
  duo: StatsDetail;
  squad: StatsDetail;
  ltm: StatsDetail;
}

interface UserDataType {
  username: string;
  battlePass: { level: number; progress: number; };
  image: string | null;
  stats: AllStats;
  lastModified: string;
}

// Define the server configuration
// This will read from the .env file in the root directory
const server = {
  API_KEY: import.meta.env.VITE_API_KEY, // Use the environment variable or fallback to a default value
  BASE_URL: 'https://fortnite-api.com/v2/stats/br/v2',
  SHOP_URL: `https://fortnite-api.com/v2/shop`,
  COSMETICS_URL: `https://fortnite-api.com/v2/cosmetics/br/`
};


function App() {

const { isDarkMode } = useTheme();
const [userData, setUserData] = useState<UserDataType | null>(null);
const [user, setUser] = useState("");
const [wins, setWins] = useState(0);
const [matches, setMatches] = useState(0);
const [kd, setKd] = useState(0);
const[profileImages, setProfileImages] = useState<string[]>([]);
const [compare, setCompare] = useState<UserDataType | null>(null);
const [compareUser, setCompareUser] = useState(""); 
const MODES = ["solo", "duo", "squad"] as const;
const [kdData, setKdData] = useState(
  MODES.map(name => ({ name, kd: 0 }))
);
const [winrateData, setWinRateData] = useState(
  MODES.map(name => ({ name, winrate: 0 }))
);
const [winData, setWinData] = useState(
  MODES.map(name => ({ name, wins: 0 }))
);

 async function getFortniteStats(searchParam :string | FormData): Promise<UserDataType | null> {

  
  let username: string | FormDataEntryValue;
  // Check if searchParams is a string or an object
    if (typeof searchParam === 'string') {
      username = searchParam;
    }else if (searchParam instanceof FormData) {
      username = searchParam.get('search') as string;
    } else {
        return null;
    }
 
  try {
    const response = await axios.get(`${server.BASE_URL}?name=${username}`, {
      headers: { Authorization: server.API_KEY }
    });

  if( response.status !== 200 || !response.data || response.data.error) {
    return null;
  }
  const { battlePass, image, stats } = response.data.data;
   // Return all relevant data for the caller to handle
    return {
      username: username as string,
      battlePass,
      image,
      stats: stats.all,
      lastModified: response.data.data.stats.all.overall.lastModified
    };
  } catch (error) {
    return null
  }
  
}

function deleteUser() {
  if(compareUser){
    setUserData(compare);
    setUser(compareUser);
    setCompare(null);
    setCompareUser("")
  } else{
    setUserData(null);
    setUser("");
  }
  
}

function deleteCompareUser() {
  setCompare(null);
  setCompareUser("");
}

function Stats() {
  return (
    <>
      {userData ? (
        <PlayerOverview
          user={user}
          userData={userData}
          compare={compare}
          compareUser={compareUser}
          kdData={kdData}
          winrateData={winrateData}
          winData={winData}
          isDarkMode={isDarkMode}
          deleteUser={deleteUser}
          deleteCompareUser={deleteCompareUser}
        />
      ) : ""}
    </>
  );
}
  
//UseEffects
useEffect(() => {
  if (!userData || !userData.stats) return;

  const stats = userData.stats;
  const overall = stats.overall;

  setWins(overall.wins);
  setKd(overall.kd);
  setMatches(overall.matches);

  setKdData(MODES.map(mode => ({ name: mode, kd: stats[mode]?.kd ?? 0 })));
  setWinRateData(MODES.map(mode => ({ name: mode, winrate: stats[mode]?.winRate ?? 0 })));
  setWinData(MODES.map(mode => ({ name: mode, wins: stats[mode]?.wins ?? 0 })));

}, [userData]);

useEffect(() =>  {
  async function getProfileImages(){
    try{
      const response = await axios.get(`${server.COSMETICS_URL}`);
      const cosmetics = response.data.data.filter((skin: any) => skin.type.value === "outfit")
      const images = cosmetics.map((skin: any) => skin.images.icon);
      
      return images;
    }catch(error){
      console.error(error)
      return [];
    }
  }
  
  getProfileImages().then(images => setProfileImages(images))
 },[])

 // Assigns a profile image to the main user when they are first loaded.
 useEffect(() => {
  if (userData && !userData.image && profileImages.length > 0) {
    const randomImage = profileImages[Math.floor(Math.random() * profileImages.length)];
    setUserData((prev) => (prev ? { ...prev, image: randomImage } : null));
  }
 }, [userData, profileImages]);

 useEffect(() => {
  // Assigns a profile image to the comparison user when they are first loaded.
  if (compare && !compare.image && profileImages.length > 0) {
    const randomImage = profileImages[Math.floor(Math.random() * profileImages.length)];
    setCompare((prev) => (prev ? { ...prev, image: randomImage } : null));
  }
 }, [compare, profileImages]);

 useEffect(() => {
  // This effect ensures that the two profile images are never the same.
  // If a clash is detected, it re-rolls the image for the 'compare' user.
  if (
    userData?.image &&
    compare?.image &&
    userData.image === compare.image &&
    profileImages.length > 1
  ) {
    let newImage;
    do {
      newImage = profileImages[Math.floor(Math.random() * profileImages.length)];
    } while (newImage === userData.image); // Keep re-rolling until it's different
    setCompare((prev) => (prev ? { ...prev, image: newImage } : null));
  }
 }, [userData?.image, compare?.image, profileImages]);


  return (
    <>
    <div className={`Main-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className={`main-page-header-container ${userData ? 'content-loaded' : ''}`}>
        <h1 className={'main-page-header'}>Fortnite<span className={'nexus'}>Nexus</span></h1>
        <p>Get your Fortnite stats in one place!</p>
        <p>Search for your Fortnite stats by username.</p>
    <form 
  onSubmit={async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  let searchValue = formData.get('search') as string;
  const isCompare = formData.get('compare') === 'on';

  if(searchValue !== null){
  searchValue = searchValue.trim();
  searchValue = searchValue.replace(/[^\w]/g, '').slice(0, 32);
  }

   if (isCompare && searchValue === user) {
    alert("Can't compare to self");
    return;
  }
const result = await getFortniteStats(formData);
  if (!result) {
    alert('Error fetching data. Please try again later.');
    return;
  }
  if (isCompare) {
    setCompareUser(result?.username);
    setCompare(result);
  } else {
    setUser(result.username);
    setUserData(result);
  }
}}
>
  <input className={`searchInput ${isDarkMode ? 'dark-mode' : ''}`} type="text" placeholder="Search.." name="search"/>
  <input className='compare' type='checkbox' id="compare" name="compare"/>
  <label htmlFor="compare">Compare</label>
</form>
      </div>
      { userData && <Stats /> }
      </div>
    </>
  )
}

export default App