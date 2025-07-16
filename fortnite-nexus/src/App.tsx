import React, { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios';
import { BarChart} from '@mui/x-charts/BarChart';

// Define the server configuration
// This will read from the .env file in the root directory
const server = {
  API_KEY: import.meta.env.VITE_API_KEY, // Use the environment variable or fallback to a default value
  BASE_URL: 'https://fortnite-api.com/v2/stats/br/v2'
};

console.log("Server configuration:", server.API_KEY);

function App() {

const [userData, setUserData] = useState<UserDataType | null>(null);
const [user, setUser] = useState(null); // Default username for userDataing
const [wins, setWins] = useState(0);
const [matches, setMatches] = useState(0);
const [kd, setKd] = useState(0);

type UserDataType = {
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




const [compare, setCompare] = useState<UserDataType | null>(null);
const [compareUser, setCompareUser] = useState(""); // Default username for comparison

// console.log(compareUserData)

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
    kd: typeof kd === "number" ? kd : parseFloat(getKd() ?? "0"),
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
                color: getStatBg(compareStats[key], userStats[key]) // <-- swapped order!
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

type BarChartProps = {
  user: string;
  userData: { solo: number; duo: number; squad: number };
  compareUser?: string;
  compareData?: { solo: number; duo: number; squad: number };
  label?: string;
  color?: string[];
  sx?: React.CSSProperties;
}

const barChartCSS ={
  '.MuiChartsAxis-tickLabel': { fill: '#718096 !important' },
  '.MuiChartsAxis-label': { fill: '#718096 !important' },
  '.MuiChartsBar-label': { fill: '#718096 !important' },
  '.MuiChartsBar-bar:hover': { fill: '#82ca9d !important'},
  '.MuiChartsAxis-line': { stroke: '#718096 !important', strokeWidth: 1 },
  '.css-ra8wgq-MuiChartsAxis-root-MuiChartsYAxis-root .MuiChartsAxis-tick': { stroke: '#718096 !important'},
  '.css-1yscjcf-MuiChartsAxis-root-MuiChartsXAxis-root .MuiChartsAxis-tick': { stroke: '#718096 !important'},
  '.css-m5rwh5-MuiBarLabel-root': {fill: '#ffff !important'},}

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






function Profile(props: {whatUser: string, profileClass: string, orientation: string, whatUserData: UserDataType | null}) {
  const level =
    props.whatUserData?.data?.battlePass.level ??
    props.whatUserData?.battlePass?.level ??
    "N/A";
  const progress =
    props.whatUserData?.data?.battlePass.progress ??
    props.whatUserData?.battlePass?.progress ??
    "N/A";
  return (
    <div className='skeleton-card profile-container'>
    <div className={`${props.profileClass}`}>
      <div className={`profile-avatar profile-info--${props.orientation}`}>
        <img
          className="profile-image"
          src={
            "https://fortnite-api.com/images/cosmetics/br/cid_a_063_athena_commando_f_cottoncandy/variants/material/mat1.png"
          }
          alt="Profile"
        />
      </div>
      <div className="profile-info">
        <h2>{props.whatUser}</h2>
        <hr />
        <p>Level: {level}</p>
        <p>Progress: {progress}%</p>
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
          solo: compare.stats.solo.kd,
          duo: compare.stats.duo.kd,
          squad: compare.stats.squad.kd,
        }
      : undefined
  }
/>
</div>
</div>
</div>
<div className='skeleton-card'>
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


function  Test() {
  return(<>
  <div className='paragraph'>
    <div className='profile-container'> 
      <Profile whatUser={user} profileClass='profile-one' orientation='left' whatUserData={userData} />
      {compare? <Versus /> : ""}

    {/* User 2 after select */}
    { compare ? <Profile whatUser={compareUser} profileClass ='profile-two' orientation='right' whatUserData={compare} /> : ""}
    
    </div>
        <div>
          <br/>
        <div className='stats-container'>
          {compare ? <StatsItemWithCompare /> : <StatsItem /> }

        <Graphs />        
        </div>
      </div>
      
      </div>
  </>)
}

function Stats() {
  return(<>
{ userData ? <Test/> : ""}
  </>
  )}
      

function Skeleton() {
  return (<>
   <div className="skeleton-card">
        <div className="skeleton-loader">
            <div className="skeleton-line" style={{width: "75%"}}></div>
            <div className="skeleton-line" style={{width: "75%"}}></div>
            <br/>
            <div className="skeleton-line" style={{width: "66.666%"}}></div>
            <br/>
            <div className="skeleton-line" style={{width: "50%"}}></div>
            <br/>
            <div className="skeleton-line" style={{width: "50%"}}></div>
            <br/>
            <div className="skeleton-line" style={{width: "50%"}}></div>
        </div>
    </div>
  </>)
}




useEffect(() => {
  async function fetchUserStats() {
    if (userData) {
        console.log(user)
        setWins(userData.stats.wins);
        setKd(userData.stats.kd);
        setMatches(userData.stats.matches);
      
    }
  }
  fetchUserStats();
}, [user]);



useEffect(() => {
  if (!userData) return;

  // Prefer the .data.stats.all structure if present, else fallback
  const stats = userData.data?.stats?.all || userData.stats;
  const solo = stats.solo;
  const duo = stats.duo;
  const squad = stats.squad;
  const overall = stats.overall;

  setWins(overall.wins);
  setKd(overall.kd);
  setMatches(overall.matches);

setKdData(MODES.map(mode => ({ name: mode, kd: stats[mode].kd })));
setWinRateData(MODES.map(mode => ({ name: mode, winrate: stats[mode].winRate })));
setWinData(MODES.map(mode => ({ name: mode, wins: stats[mode].wins })));
}, [userData]);


  return (
    <>
    <div className="Main-container">
      <div className="main-page-header-container">
      <h1 className='main-page-header'>Fortnite<span className='nexus'>Nexus</span></h1>
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
  <input className='searchInput' type="text" placeholder="Search.." name="search"/>
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
