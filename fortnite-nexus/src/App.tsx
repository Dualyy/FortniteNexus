import React, { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios';
import { BarChart, barClasses, barElementClasses, barLabelClasses } from '@mui/x-charts/BarChart';
import Checkbox from '@mui/material/Checkbox';

// Define the server configuration
// This will read from the .env file in the root directory
const server = {
  API_KEY: import.meta.env.VITE_API_KEY, // Use the environment variable or fallback to a default value
  BASE_URL: 'https://fortnite-api.com/v2/stats/br/v2'
};

console.log("Server configuration:", server.API_KEY);



function App() {
const [test, setTest] = useState(null);
const [user, setUser] = useState("exiira.x3"); // Default username for testing
const [wins, setWins] = useState(0);
const [matches, setMatches] = useState(0);
const [kd, setKd] = useState(0);
const [compare, setCompare] = useState(null);
const [compareUser, setCompareUser] = useState(""); // Default username for comparison
const [DuoKd, setDuoKd] = useState(0);
const [SquadKd, setSquadKd] = useState(0);
const [compareBool, setCompareBool] = useState(false);

function getCompareUserData(){
  console.log("test")
}


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
      username = searchParam.get('search');
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
    
   // Return all relevant data for the caller to handle
    return {
      username,
      stats: response.data.data.stats.all,
      battlePass: response.data.data.battlePass,
      raw: response.data
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error fetching data. Please try again later.');
  }
  
}


function setGraphData() {
  if (test) {
    setKdData(prevData =>
      prevData.map(item => {
        if (item.name === "solo") return { ...item, kd: test.data.stats.all.solo.kd };
        if (item.name === "duo") return { ...item, kd: test.data.stats.all.duo.kd };
        if (item.name === "squad") return { ...item, kd: test.data.stats.all.squad.kd };
        return item;
      })
    );
  }
}

function getWins() {
  if (test) {
    return wins;
  }
}

function getMatches() {
  if (test) {
    return matches;
  }
}

function getKd() {
  if (test) {
    return kd;
  }
}

function getLevel() {
  if (test) {
    if(test.data){
    return test.data.battlePass.level;
    } else{ return test.battlePass.level}
  }
}

function getImage(){
  if (test) {
    // console.log(test.data.image);
    return test.data.image
  }
}

function getProgress() {
  if (test) {
    if(test.data){
    return test.data.battlePass.progress;
    } else {return test.battlePass.progress}
  }
}

function getWinRate() {
  if (test) {
    const winRate = (wins / matches) * 100;
    return winRate.toFixed(2) + '%';
  }
}

function getWinRateDuo() {
  if (test) {
    const winRate = test.data.stats.all.duo.wins / test.data.stats.all.duo.matches * 100;
    return winRate.toFixed(2) + '%';
  }
}

function getWinRateSquad() {
  if (test) {
    const winRate = test.data.stats.all.squad.wins / test.data.stats.all.squad.matches * 100;
    return winRate.toFixed(2) + '%';
  }
}

function setWinrateData(){
  if(test) {
    setWinRateData(prevData => {
      prevData.map(item => {
        if(item.name ==="solo") return {...item, winrate: getWinRate()}
        if(item.name==="duo") return {...item, winrate: getWinRateDuo()}
        if(item.name==="squad") return {...item, winrate: getWinRateSquad()}
      })
    })
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
  <h3>{user}</h3>
  </div>
  <div className='user-stats-info'>
   <div className='stats-item' style={{
    background: compare.stats.overall.wins < parseFloat(getWins()) ? "green" : "red"
  }}>
          <h4>Wins</h4>
          <h3>{getWins()}</h3>
          </div>
        <div className='stats-item'>
          <h4>Matches played</h4>
          <h3>{getMatches()}</h3>
        </div>
        <div className='stats-item' style={{
    background: compare.stats.overall.kd < parseFloat(getKd()) ? "green" : "red"
  }}>
          <h4>K/D</h4>
          <h3>{getKd()}</h3>
        </div>
        <div className='stats-item' style={{
    background: compare.stats.overall.winRate < parseFloat(getWinRate()) ? "green" : "red"
  }}>
          <h4>win rate</h4>
          <h3>{parseInt(getWinRate()).toFixed(2)+ '%'}</h3>
        </div>
        </div>
        <div className="user2"> 
          <div className='header-user-stat'>
  <h3>{compare.username}</h3>
  </div>
  <div className='user-stats-info'>
   <div className='stats-item' style={{
    background: compare.stats.overall.wins > parseFloat(getWins()) ? "green" : "red"
  }}>
          <h4>Wins</h4>
          <h3>{compare.stats.overall.wins}</h3>
          </div>
        <div className='stats-item' >
          <h4>Matches played</h4>
          <h3>{compare.stats.overall.matches}</h3>
        </div>
        <div className='stats-item' style={{
    background: compare.stats.overall.kd > parseFloat(getKd()) ? "green" : "red"
  }}>
          <h4>K/D</h4>
          <h3>{compare.stats.overall.kd}</h3>
        </div>
       <div
  className='stats-item'
  style={{
    background: compare.stats.overall.winRate > parseFloat(getWinRate()) ? "green" : "red"
  }}
>
          <h4>win rate</h4>
          <h3>{compare.stats.overall.winRate.toFixed(2) + '%'}</h3>
        </div>
        </div>
        </div>
        </div>
        
        </>)
}

function BarChartComponent() {
  if(compare && test){
    // console.log(compare)
return (<BarChart 
  dataset={kdData}
      xAxis={[{ data: ['Solo', 'Duo', 'Squad'] }]}
      series={[{ data: [kdData[0].kd, kdData[1].kd, kdData[2].kd], label: `${user}`},{ data: [compare.stats.solo.kd, compare.stats.duo.kd, compare.stats.squad.kd], label: `${compareUser}`} ]}
      
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
    />)

    }
  if (!test) return null;
  return (
    <BarChart 
      xAxis={[{ data: ['Solo', 'Duo', 'Squad'] }]}
      series={[{ data: [kdData[0].kd, kdData[1].kd, kdData[2].kd] } ]}
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
function BarChartComponentWinRate() {
  if(compare && test){
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
  if (!test) return null;
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
  if(compare && test) {
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
  if (!test) return null;
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

function Stats() {
  return(<>
<div className='paragraph'>
  <div className="skeleton-card">
    <div className='profile-container'> 
      <div className='profile-one'>
      <div className='profile-avatar profile-info--left'>
        <img className='profile-image' src={'https://fortnite-api.com/images/cosmetics/br/cid_a_063_athena_commando_f_cottoncandy/variants/material/mat1.png'} alt="Profile" />
      </div>
      <div className='profile-info'>
        <h2>{user}</h2>
        <hr/>
        <p>Level: {getLevel()}</p>
        <p>Progress: {getProgress()}%</p>
      </div>
    </div>
    {/* User 2 after select */}
    <div className="versus">
      <h3>V/S</h3>
    </div>
    <div className='profile-two'>
      <div className='profile-info--right profile-info'>
        <h2>{compareUser}</h2>
        <hr/>
        {compare ? <BattlePass /> : "Loading...."}
        
      </div>
       <div className='profile-avatar'>
        <img className='profile-image' src={'https://fortnite-api.com/images/cosmetics/br/cid_a_063_athena_commando_f_cottoncandy/variants/material/mat1.png'} alt="Profile" />
      </div>
    </div>
    </div>
        <div>
          <br/>
        <div className='stats-container'>
          {compare ? <StatsItemWithCompare /> : <StatsItem /> }
        
        <div className='graphs'>
        <div className='stats-item-graph'>
          <h2>K/D ratio</h2>
  <BarChartComponent />
</div>
<div className='stats-item-graph'>
  <h2>win rate %</h2>
  <BarChartComponentWinRate />
</div>
<div className='stats-item-graph'>
  <h2>wins</h2>
  <BarChartComponentWin />
</div>
</div>
        </div>
      </div>
      </div>
      </div>
  </>
  )}
      

function skeleton() {
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
        setTest(userOneStats.raw);
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
      setCompare(comparedUser);
    }
  }
  fetchCompareStats();
}, [compareUser]);

useEffect(() => {
  console.log(test)
  if (test) {
    if(test.data){
    setWins(test.data.stats.all.overall.wins)
    setKd(test.data.stats.all.overall.kd)
    setMatches(test.data.stats.all.overall.matches)
    setDuoKd(test.data.stats.all.duo.kd);
    setSquadKd(test.data.stats.all.squad.kd);
    setKdData([
      { name: "solo", kd: test.data.stats.all.solo.kd },
      { name: "duo", kd: test.data.stats.all.duo.kd },
      { name: "squad", kd: test.data.stats.all.squad.kd }
    ]);
    setWinRateData([
      { name: "solo", winrate: test.data.stats.all.solo.winRate },
      { name: "duo", winrate: test.data.stats.all.duo.winRate },
      { name: "squad", winrate: test.data.stats.all.squad.winRate }
    ]);
    setWinData([
      { name: "solo", wins: test.data.stats.all.solo.wins },
      { name: "duo", wins: test.data.stats.all.duo.wins },
      { name: "squad", wins: test.data.stats.all.squad.wins }
    ]);
    } else {
      console.log(test)
      setWins(test.stats.overall.wins)
    setKd(test.stats.overall.kd)
    setMatches(test.stats.overall.matches)
    setDuoKd(test.stats.duo.kd);
    setSquadKd(test.stats.squad.kd);
    setKdData([
      { name: "solo", kd: test.stats.solo.kd },
      { name: "duo", kd: test.stats.duo.kd },
      { name: "squad", kd: test.stats.squad.kd }
    ]);
    setWinRateData([
      { name: "solo", winrate: test.stats.solo.winRate },
      { name: "duo", winrate: test.stats.duo.winRate },
      { name: "squad", winrate: test.stats.squad.winRate }
    ]);
    setWinData([
      { name: "solo", wins: test.stats.solo.wins },
      { name: "duo", wins: test.stats.duo.wins },
      { name: "squad", wins: test.stats.squad.wins }
    ]);
    }
  }  

}, [test]);


  return (
    <>
    <div className="Main-container">
      <h1 className='main-page-header'>Fortnite<span className='nexus'>Nexus</span></h1>
      <p>Get your Fortnite stats in one place!</p>
      <p>Search for your Fortnite stats by username.</p>
    <form
  onSubmit={async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const searchValue = formData.get('search');
  const isCompare = formData.get('compare') === 'on';

  if (isCompare) {
    setCompareUser(searchValue);
  } else {
    if (user !== searchValue) {
      setUser(searchValue);
    }
  }
}}
>
  <input className='searchInput' type="text" placeholder="Search.." name="search"/>
  <input className='compare' type='checkbox' id="compare" name="compare"/>
  <label htmlFor="compare">Compare</label>
</form>
      
      { test ? <Stats /> : skeleton() }
      </div>
    </>
  )
}

export default App
