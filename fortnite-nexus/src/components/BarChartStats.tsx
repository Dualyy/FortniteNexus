import { BarChart} from '@mui/x-charts/BarChart';
import { BarChartProps } from './../types/BarChartProps';
import { useTheme } from './../ThemeContext';


const MODES = ["solo", "duo", "squad"] as const;
const colors = ['#137a7f', '#5ac8d1', '#86cecb']


export default function BarChartStats({
  
  user,
  userData,
  compareUser,
  compareData,
  color = colors,
}: BarChartProps) {
    const { isDarkMode } = useTheme();
    const barChartCSS ={
        '.MuiChartsAxis-tickLabel': { fill: `${isDarkMode ? '#ffffff' : '#137a7f'} !important` },
        '.MuiChartsAxis-label': { fill: `${isDarkMode ? '#ffffff' : '#137a7f'} !important` },
        '.MuiChartsBar-label': { fill: `${isDarkMode ? '#ffffff' : '#137a7f'} !important` },
        '.MuiChartsAxis-line': { stroke: `${isDarkMode ? '#bec8d1' : '#137a7f'} !important`, strokeWidth: 1 },
        '.css-ra8wgq-MuiChartsAxis-root-MuiChartsYAxis-root .MuiChartsAxis-tick': { stroke: `${isDarkMode ? '#bec8d1' : '#137a7f'} !important`},
        '.css-1yscjcf-MuiChartsAxis-root-MuiChartsXAxis-root .MuiChartsAxis-tick': { stroke: `${isDarkMode ? '#bec8d1' : '#137a7f'} !important`},
        '.css-m5rwh5-MuiBarLabel-root': {fill: `${isDarkMode ? '#ffffff' : '#373b3e'} !important`},
        '.css-18dsvps-MuiChartsLegend-root': {color: `${isDarkMode ? '#bec8d1' : '#373b3e'} !important`}
    }
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