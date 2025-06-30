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
const [test, setTest] = useState(null);
const [user, setUser] = useState("exiira.x3"); // Default username for testing
const [wins, setWins] = useState(0);
const [matches, setMatches] = useState(0);
const [kd, setKd] = useState(0);
const [compare, setCompare] = useState(null);
const [compareUser, setCompareUser] = useState("guzimanis"); // Default username for comparison
const [DuoKd, setDuoKd] = useState(0);
const [SquadKd, setSquadKd] = useState(0);
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
      setUser(username);
    }

     if (typeof searchParam === 'string' && response.status === 200) {
      username = searchParam;
      setUser(username)
    }else if (searchParam instanceof FormData && response.status === 200) {
      username = searchParam.get('search');
      setUser(username as string);
    } else {
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
    console.log(username)
    setUser((prevUser) => prevUser); // Reset to default username
    return;
  }
    
    setTest((response.data));
    setWins(response.data.data.stats.all.solo.wins);
    setMatches(response.data.data.stats.all.solo.matches);
    setKd(response.data.data.stats.all.solo.kd);
  
    return response.data;
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
    return test.data.battlePass.level;
  }
}

function getImage(){
  if (test) {
    console.log(test.data.image);
    return test.data.image
  }
}

function getProgress() {
  if (test) {
    return test.data.battlePass.progress;
  }
}

function getWinRate() {
  if (test) {
    const winRate = (wins / matches) * 100;
    return winRate.toFixed(2) + '%';
  }
}



function BarChartComponent() {
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

function Stats() {
  return(<>
<div className='paragraph'>
  <div className="skeleton-card">
    <div className='profile-container'> 
      <div className='profile-avatar'>
        <img className='profile-image' src={'https://fortnite-api.com/images/cosmetics/br/cid_a_063_athena_commando_f_cottoncandy/variants/material/mat1.png'} alt="Profile" />
      </div>
      <div className='profile-info'>
        <h2>{user}</h2>
        <hr/>
        <p>Level: {getLevel()}</p>
        <p>Progress: {getProgress()}%</p>
      </div>
    

    </div>
        <div>
          <br/>
        <div className='stats-container'>
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
        <div className='stats-item-graph'>
  <BarChartComponent />
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
  getFortniteStats(user);
  // Don't call setTest here, it's already called in getFortniteStats
  // Don't call setGraphData here
}, []);

useEffect(() => {
  if (test) {
    setDuoKd(test.data.stats.all.duo.kd);
    setSquadKd(test.data.stats.all.squad.kd);
    setKdData([
      { name: "solo", kd: test.data.stats.all.solo.kd },
      { name: "duo", kd: test.data.stats.all.duo.kd },
      { name: "squad", kd: test.data.stats.all.squad.kd }
    ]);
  }
}, [test]);


  return (
    <>
    <div className="Main-container">
      <h1 className='main-page-header'>Fortnite<span className='nexus'>Nexus</span></h1>
      <p>Get your Fortnite stats in one place!</p>
      <p>Search for your Fortnite stats by username.</p>

    <form action={getFortniteStats} method="get">
      <input className='searchInput' type="text" placeholder="Search.." name="search"/>
    </form>
      
      { test ? <Stats /> : skeleton() }
      </div>
    </>
  )
}

export default App
