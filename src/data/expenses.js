
import * as d3 from 'd3';

// zero-based: 11 - Dec, 1- Feb
const dateRange = d3.timeDay.range(new Date(2020, 0, 1), new Date(2020, 2, 1), 1);

export const expPreview_id = 'EXPENSE_PREVIEW';
export const exps = [
{id: 0, description: 'Tim Hortons', amount: 3.45, date: dateRange[Math.floor(Math.random() * dateRange.length)]}, 
{id: 1, description: 'Villa Madina', amount: 30, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 2, description: 'Flight ticket', amount: 384.33, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 3, description: 'Airbnb', amount: 112.11, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 4, description: 'Villa Madina', amount: 21.75, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 5, description: 'Starbucks', amount: 5.15, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 6, description: 'Starbucks', amount: 3.75, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 7, description: 'Pusateris', amount: 15.55, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 8, description: 'Starbucks', amount: 3.75, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 9, description: 'Villa Madina', amount: 21.75, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 10, description: 'Starbucks', amount: 7.30, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 11, description: 'Starbucks', amount: 3.40, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 12, description: 'Bulk n Barn', amount: 17.25, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 13, description: 'Starbucks', amount: 7.30, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 14, description: 'Winners-coat', amount: 97.99, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 15, description: 'FrontEnd Masters subscrip.', amount: 15.33, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 16, description: 'Starbucks', amount: 7.30, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 17, description: 'Starbucks', amount: 4.75, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 18, description: 'Pusateris', amount: 15.20, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 19, description: 'Davids Tea', amount: 21, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 20, description: 'Walmart', amount: 45.30, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 21, description: 'Starbucks', amount: 7.30, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 22, description: 'Walmart', amount: 77.8, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 23, description: 'Starbucks', amount: 3.30, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 24, description: 'HTC ViVE', amount: 300, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 25, description: 'Walmart', amount: 27.1, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 26, description: 'Gym membership', amount: 16.75, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 27, description: 'Gym membership', amount: 16.75, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 28, description: 'Gym membership', amount: 16.75, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 29, description: 'Gym membership', amount: 16.75, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 30, description: 'Kinoplex', amount: 25, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 31, description: 'Starbucks', amount: 7.30, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
{id: 32, description: 'D3js book', amount: 89.21, date: dateRange[Math.floor(Math.random() * dateRange.length)]},
];