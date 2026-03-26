import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartProps {
  data: any[];
  height?: number;
}

// Line Chart
interface LineChartComponentProps extends ChartProps {
  dataKey: string;
  xAxisKey: string;
  color?: string;
}

export function LineChartComponent({ 
  data, 
  dataKey, 
  xAxisKey, 
  height = 300,
  color = 'hsl(var(--chart-1))' 
}: LineChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={200} minHeight={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey={xAxisKey} 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2}
          dot={{ fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Bar Chart
interface BarChartComponentProps extends ChartProps {
  dataKey: string;
  xAxisKey: string;
  color?: string;
}

export function BarChartComponent({ 
  data, 
  dataKey, 
  xAxisKey, 
  height = 300,
  color = 'hsl(var(--chart-2))' 
}: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={200} minHeight={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey={xAxisKey} 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Area Chart
interface AreaChartComponentProps extends ChartProps {
  dataKey: string;
  xAxisKey: string;
  color?: string;
}

export function AreaChartComponent({ 
  data, 
  dataKey, 
  xAxisKey, 
  height = 300,
  color = 'hsl(var(--chart-3))' 
}: AreaChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={200} minHeight={200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey={xAxisKey} 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          fill={color}
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Donut Chart
interface DonutChartComponentProps extends ChartProps {
  dataKey: string;
  nameKey: string;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function DonutChartComponent({ 
  data, 
  dataKey, 
  nameKey, 
  height = 300 
}: DonutChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={200} minHeight={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}