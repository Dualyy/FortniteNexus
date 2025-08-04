import React, { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios';
import { BarChart} from '@mui/x-charts/BarChart';
import {nanoid} from 'nanoid';
import { useTheme } from './ThemeContext';
import { get } from 'http';

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
const [user, setUser] = useState(null); // Default username for userDataing
const [wins, setWins] = useState(0);
const [matches, setMatches] = useState(0);
const [kd, setKd] = useState(0);
const[profileImages, setProfileImages] = useState<string[]>([]);
const [compare, setCompare] = useState<UserDataType | null>(null);
const [compareUser, setCompareUser] = useState(""); // Default username for comparison
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

//types
type UserDataType = {
  image: string;
  username: string;
  lastModified?: string;
  raw?: object; // Raw data from the API, can be used for debugging or further
  data?: {
    stats: {
      all: {
        overall: {
          wins: number;
          matches: number;
          kd: number;
          winRate: number;
          lastModified?: string;
        };
        solo: {
          kd: number;
          winRate: number;
          wins: number;
        };
        duo: {
          kd: number;
          winRate: number;
          wins: number;
        };
        squad: {
          kd: number;
          winRate: number;
          wins: number;
        };
      };
    };
    battlePass: {
      level: number;
      progress: number;
    };
  };
  stats?: {
    overall: {
      wins: number;
      matches: number;
      kd: number;
      winRate: number;
    };
    solo: {
      kd: number;
      winRate: number;
      wins: number;
    };
    duo: {
      kd: number;
      winRate: number;
      wins: number;
    };
    squad: {
      kd: number;
      winRate: number;
      wins: number;
    };
  };
  battlePass?: {
    level: number;
    progress: number;
  };

};

type BarChartProps = {
  user: string;
  userData: { solo: number; duo: number; squad: number };
  compareUser?: string;
  compareData?: { solo: number; duo: number; squad: number };
  label?: string;
  color?: string[];
  sx?: React.CSSProperties;
}

 async function getFortniteStats(searchParam :string | FormData) {

  
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
   // Return all relevant data for the caller to handle
    return {
      username,
      stats: response.data.data.stats.all,
      battlePass: response.data.data.battlePass,
      raw: response.data,
      lastModified: response.data.data.stats.all.overall.lastModified
    };
  } catch (error) {
    return null
  }
  
}

//functions
function getWins() {
  if (userData) {
    return wins;
  }
}

function getMatches() {
  if (userData) {
    return matches;
  }
}

function getKd() {
  if (userData) {
    return kd;
  }
}

function getWinRate() {
  if (userData) {
    const winRate = (wins / matches) * 100;
    return winRate.toFixed(2);
  }
}

function StatsItem(){
  return (<>
 <div className="skeleton-card">
  <div className="header-user-stat">
  <h2>Performance overview</h2>
  </div>
  <div className='stats-item-container'>
   <div className='stats-item'>
          <h4>Wins</h4>
          <h3>{getWins()}</h3>
          </div>
        <div className='stats-item'>
          <h4>Matches played</h4>
          <h3>{getMatches()}</h3>
        </div>
        <div className='stats-item'>
          <h4>K/D</h4>
          <h3>{getKd()}</h3>
        </div>
        <div className='stats-item'>
          <h4>win rate</h4>
          <h3>{getWinRate()}</h3>
        </div>
        </div>
        </div>
        </>)
}

function getStatBg(userValue: number, compareValue: number) {
  if (userValue > compareValue) return "green";
  if (userValue < compareValue) return "red";
  return "gray"; // or leave as default
}

const statKeys = [
  { key: "wins", label: "Wins" },
  { key: "matches", label: "Matches played" },
  { key: "kd", label: "K/D" },
  { key: "winRate", label: "Win rate", format: (v: number) => v.toFixed(2) + "%" }
];

function StatsItemWithCompare() {
  const userStats = {
    wins: getWins() ?? 0,
    matches: getMatches() ?? 0,
    kd: typeof kd === "number" ? kd : getKd() ?? 0,
    winRate: parseFloat(getWinRate() ?? "0"),
  };
  const compareStats = {
    wins: compare?.stats?.overall?.wins ?? 0,
    matches: compare?.stats?.overall?.matches ?? 0,
    kd: compare?.stats?.overall?.kd ?? 0,
    winRate: compare?.stats?.overall?.winRate ?? 0,
  };

  return (
    <div className="skeleton-card stats-item-with-compare">
      <div className="user1">
        <div className="header-user-stat">
          <h3>{user}</h3>
          <p className="lastUpdate">
            ({new Date(userData?.lastModified ?? "").toString()})
          </p>
        </div>
        <div className="user-stats-info">
          {statKeys.map(({ key, label, format }) => (
            <div
              key={key}
              className="stats-item"
              style={{
                color: getStatBg(userStats[key], compareStats[key])
              }}
            >
              <h4>{label}</h4>
              <h3>{format ? format(userStats[key]) : userStats[key]}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="user2">
        <div className="header-user-stat">
          <h3>{compare?.username}</h3>
          <p className="lastUpdate">
            {new Date(compare?.lastModified ?? "").toString()}
          </p>
        </div>
        <div className="user-stats-info">
          {statKeys.map(({ key, label, format }) => (
            <div
              key={key}
              className="stats-item"
              style={{
                color: getStatBg(compareStats[key], userStats[key])
              }}
            >
              <h4>{label}</h4>
              <h3>{format ? format(compareStats[key]) : compareStats[key]}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const barChartCSS ={
  '.MuiChartsAxis-tickLabel': { fill: '#718096 !important' },
  '.MuiChartsAxis-label': { fill: '#718096 !important' },
  '.MuiChartsBar-label': { fill: '#718096 !important' },
  '.MuiChartsBar-bar:hover': { fill: '#82ca9d !important'},
  '.MuiChartsAxis-line': { stroke: '#718096 !important', strokeWidth: 1 },
  '.css-ra8wgq-MuiChartsAxis-root-MuiChartsYAxis-root .MuiChartsAxis-tick': { stroke: '#718096 !important'},
  '.css-1yscjcf-MuiChartsAxis-root-MuiChartsXAxis-root .MuiChartsAxis-tick': { stroke: '#718096 !important'},
  '.css-m5rwh5-MuiBarLabel-root': {fill: '#ffff !important'},
  '.css-18dsvps-MuiChartsLegend-root': {color: `${isDarkMode ? '#F7FAFC' : '#718096'}`}
}

const colors = ['#2B6CB0', '#1e4c7c', '#ffc658']

function BarChartStats({
  
  user,
  userData,
  compareUser,
  compareData,
  color = colors,
}: BarChartProps) {
  const series = [
    {
      data: [userData.solo, userData.duo, userData.squad],
      label: user,
    },
  ];
  if (compareUser && compareData) {
    series.push({
      data: [compareData.solo, compareData.duo, compareData.squad],
      label: compareUser,
    });
  }
  return (
    
    <BarChart
      xAxis={[{ data: MODES }]}
      series={series}
      height={300}
      barLabel="value"
      colors={color}
      sx={barChartCSS}
    />
  );
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

function Profile(props: {onDelete: () => void , id: string,
   whatUser: string,
    profileClass: string,
     orientation: string,
      whatUserData: UserDataType | null}) {
  const level =
    props.whatUserData?.data?.battlePass.level ??
    props.whatUserData?.battlePass?.level ??
    "N/A";
  const progress =
    props.whatUserData?.data?.battlePass.progress ??
    props.whatUserData?.battlePass?.progress ??
    "N/A";

  return (
    <div className={`skeleton-card profile-container ${isDarkMode ? 'dark-mode' : ''}`}>
    <div className={`${props.profileClass}`}>
      <div className={`profile-avatar profile-info--${props.orientation} ${isDarkMode ? 'dark-mode' : ''}`}>
        <img
          className="profile-image"
          src={props.whatUserData?.image}
          alt="Profile"
        />
      </div>
      <div className={`profile-info ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2>{props.whatUser}</h2>
        <hr />
        <p>Level: {level}</p>
        <p>Progress: {progress}%</p>
        <button className={'delete-button'} id={props.id} onClick={() => props.onDelete() }>Delete</button>
      </div>
    </div>
    </div>
  );
}

function Versus(){
  return(
  <div className="versus">
      <h3>V/S</h3>
    </div>)
}

function Graphs() {
  return (<>
  <div className='skeleton-card graphs-container'>
  <div className='graphs'>
    
        <div className='stats-item-graph'>
          <h2>K/D ratio</h2>
  <BarChartStats
  label="K/D"
  user={user}
  userData={{
    solo: kdData[0].kd,
    duo: kdData[1].kd,
    squad: kdData[2].kd,
  }}
  compareUser={compare ? compareUser : undefined}
  compareData={
    compare
      ? {
          solo: compare.stats?.solo.kd,
          duo: compare.stats?.duo.kd,
          squad: compare.stats?.squad.kd,
        }
      : undefined
  }
/>
</div>
</div>
</div>
<div className={`skeleton-card ${isDarkMode ? 'dark-mode' : ''}`}>
<div className='stats-item-graph'>
  <h2>win rate %</h2>
  <BarChartStats
  label="Win Rate"
  user={user}
  userData={{
    solo: winrateData[0].winrate,
    duo: winrateData[1].winrate,
    squad: winrateData[2].winrate,
  }}
  compareUser={compare ? compareUser : undefined}
  compareData={
    compare
      ? {
          solo: compare.stats.solo.winRate,
          duo: compare.stats.duo.winRate,
          squad: compare.stats.squad.winRate,
        }
      : undefined
  }
/>
</div>
</div>
<div className='skeleton-card'>
<div className='stats-item-graph'>
  <h2>wins</h2>
  <BarChartStats
  label="Wins"
  user={user}
  userData={{
    solo: winData[0].wins,
    duo: winData[1].wins,
    squad: winData[2].wins,
  }}
  compareUser={compare ? compareUser : undefined}
  compareData={
    compare
      ? {
          solo: compare.stats.solo.wins,
          duo: compare.stats.duo.wins,
          squad: compare.stats.squad.wins,
        }
      : undefined
  }
/>
</div>
</div>

  </>)
}

function  PlayerOverview() {
  if(user)
  return(<>
  <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
  <div className='paragraph'>
    <div className='profile-container'> 
      <Profile onDelete={deleteUser} whatUser={user} profileClass='profile-one' orientation='left' whatUserData={userData} id={nanoid()} />
      {compare? <Versus /> : ""}
    {/* User 2 after select */}
    { compare ? <Profile onDelete={deleteCompareUser} whatUser={compareUser} profileClass ='profile-two' orientation='right' whatUserData={compare} id={nanoid()} /> : ""}
    
    </div>
        <div>
          <br/>
        <div className='stats-container'>
          {compare ? <StatsItemWithCompare /> : <StatsItem /> }

        <Graphs />        
        </div>
      </div>
      
      </div>
      </div>
  </>)
}

function Stats() {
  return(<>
{ userData ? <PlayerOverview/> : ""}
  </>
  )}
  
//UseEffects
useEffect(() => {
  if (!userData || !userData.stats) return;

  // Prefer the .data.stats.all structure if present, else fallback
  const stats = userData.data?.stats?.all || userData.stats;
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
      <div className={'main-page-header-container'}>
      <h1 className={'main-page-header'}>Fortnite<span className={'nexus'}>Nexus</span></h1>
      <p>Get your Fortnite stats in one place!</p>
      <p>Search for your Fortnite stats by username.</p>
    <form 
  onSubmit={async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const searchValue = formData.get('search');
  const isCompare = formData.get('compare') === 'on';

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