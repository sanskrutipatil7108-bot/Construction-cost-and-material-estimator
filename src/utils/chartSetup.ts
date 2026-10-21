import { Chart as ChartJS, registerables } from 'chart.js';

// Register all necessary Chart.js controllers (bar, doughnut, scatter, etc.), scales, elements, and plugins
ChartJS.register(...registerables);

// Global styling defaults for clean dashboard aesthetic
ChartJS.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
ChartJS.defaults.color = '#4B5563';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#14213D';
ChartJS.defaults.plugins.tooltip.titleColor = '#FFFFFF';
ChartJS.defaults.plugins.tooltip.bodyColor = '#E5E7EB';
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.boxPadding = 4;
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

export default ChartJS;
