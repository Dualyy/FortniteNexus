export type BarChartProps = {
  user: string;
  userData: { solo: number; duo: number; squad: number };
  compareUser?: string;
  compareData?: { solo: number; duo: number; squad: number };
  label?: string;
  color?: string[];
  sx?: React.CSSProperties;
}

export default BarChartProps;