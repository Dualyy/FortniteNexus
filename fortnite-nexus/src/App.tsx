import React, { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios';
import { BarChart, barClasses, barElementClasses, barLabelClasses } from '@mui/x-charts/BarChart';

// Define the server configuration
// This will read from the .env file in the root directory
const server = {
  API_KEY: import.meta.env.VITE_API_KEY, // Use the environment variable or fallback to a default value
  BASE_URL: 'https://fortnite-api.com/v2/stats/br/v2'
};

console.log("Server configuration:", server.API_KEY);

function App() {

const [userData, setUserData] = useState<UserDataType | null>(null);
const [user, setUser] = useState("exiira.x3"); // Default username for userDataing
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

const [kdData, setKdData] = useState([{
  name: "solo",
  kd: 0
},
{
  name: "duo",
  kd:0
},
{
  name: "squad",
  kd:0
}])

const [winrateData, setWinRateData] = useState([{
  name: "solo",
  winrate: 0
},
{
  name: "duo",
  winrate:0
},
{
  name: "squad",
  winrate:0
}])

const [winData, setWinData] = useState([{
  name: "solo",
  wins: 0
},
{
  name: "duo",
  wins:0
},
{
  name: "squad",
  wins:0
}])

 async function getFortniteStats(searchParam :string | FormData) {

  
  let username: string | FormDataEntryValue;
  // Check if searchParams is a string or an object
    if (typeof searchParam === 'string') {
      username = searchParam;
    }else if (searchParam instanceof FormData) {
      username = searchParam.get('search') as string;
    } else {
        console.error('Invalid searchParams type. Expected string or FormData.');
        return;
    }
  if (!username) {
    console.error('Username is required');
    return;
  }
  console.log("Fetching stats for:", username);
  
  try {
    const response = await axios.get(`${server.BASE_URL}?name=${username}`, {
      headers: { Authorization: server.API_KEY }
    });

    if (response.status === 200 ) {
      console.log(`Data fetched successfully: for  ${username}`, );
      if(username !== compareUser)
      setUser(username);
    }

     if (typeof searchParam === 'string' && response.status === 200) {
      username = searchParam;
      if(username !== compareUser) setUser(username)
    }else if (searchParam instanceof FormData && response.status === 200) {
      username = searchParam.get('search');
      if(username !== compareUser) setUser(username as string);
    } else if(username === compareUser){alert('cant compare to self')} else {
        console.error('Invalid searchParams type. Expected string or FormData.');
        alert('Invalid searchParams type. Expected string or FormData.');
        return;
    } 
  if (!username) {
    console.error('Username is required');
    return;
  }

  if( response.status !== 200 || !response.data || response.data.error) {
    console.error('Error fetching data:', response.data.error);
    alert('Error fetching data. Please try again later.');
    // console.log(username)
    setUser((prevUser) => prevUser); // Reset to default username
    return;
  }
    console.log(response.data.data.stats.all.overall.lastModified)
   // Return all relevant data for the caller to handle
    return {
      username,
      stats: response.data.data.stats.all,
      battlePass: response.data.data.battlePass,
      raw: response.data,
      lastModified: response.data.data.stats.all.overall.lastModified
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error fetching data. Please try again later.');
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
        </div></>)
}

function StatsItemWithCompare(){
  return(<>
  <div className="user1"> 
    <div className='header-user-stat'>
      {console.log(userData)}
  <h3>{user}</h3>
  <p className="lastUpdate"> ({new Date(userData?.data?.stats?.all?.overall?.lastModified).toString()}</p>
  </div>
  <div className='user-stats-info'>
   <div className='stats-item' style={{
    background: compare?.stats?.overall?.wins ?? 0 < getWins() ? "green" : "red"
  }}>
          <h4>Wins</h4>
          <h3>{getWins()}</h3>
          </div>
        <div className='stats-item'>
          <h4>Matches played</h4>
          <h3>{getMatches()}</h3>
        </div>
        <div className='stats-item' style={{
    background: (compare?.stats?.overall.kd ?? 0) < parseFloat(getKd()) ? "green" : "red"
  }}>
          <h4>K/D</h4>
          <h3>{getKd()}</h3>
        </div>
        <div className='stats-item' style={{
    background: compare?.stats?.overall.winRate ?? 0 < parseFloat(getWinRate()) ? "green" : "red"
  }}>
          <h4>win rate</h4>
          <h3>{parseInt(getWinRate()).toFixed(2)+ '%'}</h3>
        </div>
        </div>
        <div className="user2"> 
          <div className='header-user-stat'>
  <h3>{compare.username}</h3>
  {console.log(compare.lastModified)}
   <p className="lastUpdate">{new Date(compare.lastModified).toString()}</p>
  </div>
  <div className='user-stats-info'>
   <div className='stats-item' style={{
    background: (compare?.stats?.overall?.wins ?? 0) > (getWins() ?? 0) ? "green" : "red"
  }}>
          <h4>Wins</h4>
          <h3>{compare?.stats?.overall?.wins}</h3>
          </div>
        <div className='stats-item' >
          <h4>Matches played</h4>
          <h3>{compare.stats.overall.matches}</h3>
        </div>
        <div className='stats-item' style={{
    background: compare.stats.overall.kd > (getKd() ?? 0) ? "green" : "red"
  }}>
          <h4>K/D</h4>
          <h3>{compare.stats.overall.kd}</h3>
        </div>
       <div
  className='stats-item'
  style={{
    background: compare && compare.stats.overall.winRate > Number(getWinRate() ?? 0) ? "green" : "red"
  }}
>
          <h4>win rate</h4>
          <h3>{compare ? (compare.stats.overall.winRate.toFixed(2) + '%') : ''}</h3>
        </div>
        </div>
        </div>
        </div>
        
        </>)
}

type BarChartProps = {
  dataset?: any[];
  height?:number;
  barLabel?: string;
  colors: string[];
  sx: React.CSSProperties;
}

const barChartCSS ={
  '.MuiChartsAxis-tickLabel': { fill: '#ffffff !important' },
  '.MuiChartsAxis-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-bar:hover': { fill: '#82ca9d !important'},
  '.MuiChartsAxis-line': { stroke: '#ffffff !important', strokeWidth: 1 },
  '.css-ra8wgq-MuiChartsAxis-root-MuiChartsYAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-1yscjcf-MuiChartsAxis-root-MuiChartsXAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-m5rwh5-MuiBarLabel-root': {fill: '#ffffff !important'},}

  const colors = ['#43787b', '#82ca9d', '#ffc658']

function BarChartStats({
  label,
  user,
  userData,
  compareUser,
  compareData,
  color = colors,
}: BarChartStatsProps) {
  const xAxisData = ['Solo', 'Duo', 'Squad'];
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
      xAxis={[{ data: xAxisData }]}
      series={series}
      height={300}
      barLabel="value"
      colors={color}
      sx={barChartCSS}
    />
  );
}
function BarChartComponentWinRate() {
  if(compare && userData){
    return(
      <BarChart 
      xAxis={[{ data: ['Solo', 'Duo', 'Squad'] }]}
      series={[{ data: [winrateData[0].winrate, winrateData[1].winrate, winrateData[2].winrate],label: `${user}` }, {data: [compare.stats.solo.winRate,compare.stats.duo.winRate,compare.stats.squad.winRate],label: `${compareUser}`} ]}
      height={300}
      barLabel="value"
      colors={['#43787b', '#82ca9d', '#ffc658']}
     sx={{
  '.MuiChartsAxis-tickLabel': { fill: '#ffffff !important' },
  '.MuiChartsAxis-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-bar:hover': { fill: '#82ca9d !important'},
  '.MuiChartsAxis-line': { stroke: '#ffffff !important', strokeWidth: 1 },
  '.css-ra8wgq-MuiChartsAxis-root-MuiChartsYAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-1yscjcf-MuiChartsAxis-root-MuiChartsXAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-m5rwh5-MuiBarLabel-root': {fill: '#ffffff !important'},
}}
    />
    )
  }
  if (!userData) return null;
  return (
    <BarChart 
      xAxis={[{ data: ['Solo', 'Duo', 'Squad'] }]}
      series={[{ data: [winrateData[0].winrate, winrateData[1].winrate, winrateData[2].winrate] } ]}
      height={300}
      barLabel="value"
      colors={['#43787b', '#82ca9d', '#ffc658']}
     sx={{
  '.MuiChartsAxis-tickLabel': { fill: '#ffffff !important' },
  '.MuiChartsAxis-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-bar:hover': { fill: '#82ca9d !important'},
  '.MuiChartsAxis-line': { stroke: '#ffffff !important', strokeWidth: 1 },
  '.css-ra8wgq-MuiChartsAxis-root-MuiChartsYAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-1yscjcf-MuiChartsAxis-root-MuiChartsXAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-m5rwh5-MuiBarLabel-root': {fill: '#ffffff !important'},
}}
    />
  );
}

function BarChartComponentWin() {
  if(compare && userData) {
    return (
      <BarChart 
      xAxis={[{ data: ['Solo', 'Duo', 'Squad'] }]}
      series={[{ data: [winData[0].wins, winData[1].wins, winData[2].wins],label: `${user}` }, {data: [compare.stats.solo.wins,compare.stats.duo.wins,compare.stats.squad.wins,],label: `${compareUser}`} ]}
      height={300}
      barLabel="value"
      colors={['#43787b', '#82ca9d', '#ffc658']}
     sx={{
  '.MuiChartsAxis-tickLabel': { fill: '#ffffff !important' },
  '.MuiChartsAxis-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-bar:hover': { fill: '#82ca9d !important'},
  '.MuiChartsAxis-line': { stroke: '#ffffff !important', strokeWidth: 1 },
  '.css-ra8wgq-MuiChartsAxis-root-MuiChartsYAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-1yscjcf-MuiChartsAxis-root-MuiChartsXAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-m5rwh5-MuiBarLabel-root': {fill: '#ffffff !important'},
}}
    />

    )
  }
  if (!userData) return null;
  return (
    <BarChart 
      xAxis={[{ data: ['Solo', 'Duo', 'Squad'] }]}
      series={[{ data: [winData[0].wins, winData[1].wins, winData[2].wins] } ]}
      height={300}
      barLabel="value"
      colors={['#43787b', '#82ca9d', '#ffc658']}
     sx={{
  '.MuiChartsAxis-tickLabel': { fill: '#ffffff !important' },
  '.MuiChartsAxis-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-label': { fill: '#ffffff !important' },
  '.MuiChartsBar-bar:hover': { fill: '#82ca9d !important'},
  '.MuiChartsAxis-line': { stroke: '#ffffff !important', strokeWidth: 1 },
  '.css-ra8wgq-MuiChartsAxis-root-MuiChartsYAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-1yscjcf-MuiChartsAxis-root-MuiChartsXAxis-root .MuiChartsAxis-tick': { stroke: '#ffffff !important'},
  '.css-m5rwh5-MuiBarLabel-root': {fill: '#ffffff !important'},
}}
    />
  );
}

function BattlePass(){
  return (<>
        <p>Level: {compare.battlePass.level}</p>
        <p>Progress: {compare.battlePass.progress}%</p>
  </>)
}

function Profile(props: {whatUser: string, profileClass: string, orientation: string, whatUserData: UserDataType | null}) {
  return (<>
  <div className={`${props.profileClass}`}>
      <div className={`profile-avatar profile-info--${props.orientation}`}>
        <img className='profile-image' src={'https://fortnite-api.com/images/cosmetics/br/cid_a_063_athena_commando_f_cottoncandy/variants/material/mat1.png'} alt="Profile" />
      </div>
      <div className='profile-info'>
        <h2>{props.whatUser}</h2>
        <hr/>
        <p>Level: {props.whatUserData.data?.battlePass.level}</p>
        <p>Progress: {props.whatUserData.data?.battlePass.progress}%</p>
      </div>
    </div>

  </>)
}

function Versus(){
  return(
  <div className="versus">
      <h3>V/S</h3>
    </div>)
}

function Graphs() {
  return (<>
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

function Stats() {
  return(<>
<div className='paragraph'>
  <div className="skeleton-card">
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
      </div>
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
    if (user) {
      const userOneStats = await getFortniteStats(user);
      if (userOneStats) {
        setUserData(userOneStats.raw);
        setWins(userOneStats.stats.overall.wins);
        setKd(userOneStats.stats.overall.kd);
        setMatches(userOneStats.stats.overall.matches);
      }
    }
  }
  fetchUserStats();
}, [user]);

useEffect(() => {
  async function fetchCompareStats() {
    if (compareUser) {
      const comparedUser = await getFortniteStats(compareUser);
      if (comparedUser) {
        setCompare(comparedUser);
      }
    }
  }
  fetchCompareStats();
}, [compareUser]);

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

  setKdData([
    { name: "solo", kd: solo.kd },
    { name: "duo", kd: duo.kd },
    { name: "squad", kd: squad.kd }
  ]);
  setWinRateData([
    { name: "solo", winrate: solo.winRate },
    { name: "duo", winrate: duo.winRate },
    { name: "squad", winrate: squad.winRate }
  ]);
  setWinData([
    { name: "solo", wins: solo.wins },
    { name: "duo", wins: duo.wins },
    { name: "squad", wins: squad.wins }
  ]);
}, [userData]);




  return (
    <>
    <div className="Main-container">
      <h1 className='main-page-header'>Fortnite<span className='nexus'>Nexus</span></h1>
      <p>Get your Fortnite stats in one place!</p>
      <p>Search for your Fortnite stats by username.</p>
    <form
  onSubmit={async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const searchValue = formData.get('search');
  const isCompare = formData.get('compare') === 'on';

  if (isCompare) {
    setCompareUser(searchValue as string);
  } else {
    if (user !== searchValue) {
      setUser(searchValue as string);
    }
  }
}}
>
  <input className='searchInput' type="text" placeholder="Search.." name="search"/>
  <input className='compare' type='checkbox' id="compare" name="compare"/>
  <label htmlFor="compare">Compare</label>
</form>
      
      { userData ? <Stats /> : <Skeleton /> }
      </div>
    </>
  )
}

export default App
