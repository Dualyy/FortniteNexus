import { BarChart} from '@mui/x-charts/BarChart';
import { BarChartProps } from './../types/BarChartProps';
import { useTheme } from './../ThemeContext';


const MODES = ["solo", "duo", "squad"] as const;
const colors = ['#2B6CB0', '#1e4c7c', '#ffc658']


export default function BarChartStats({
  
  user,
  userData,
  compareUser,
  compareData,
  color = colors,
}: BarChartProps) {
    const { isDarkMode } = useTheme();
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