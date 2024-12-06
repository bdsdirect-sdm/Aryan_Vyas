import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Colors, BarElement } from 'chart.js';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./Chart.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

Chart.register(
    Tooltip,
    Legend,
    Colors,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement
);

const Graph: React.FC = () => {
    const location = useLocation();
    const { patientGraphData } = location.state || {};
    const navigate = useNavigate();
    const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');

   
    const calculateReferralStatus = (patientList: Array<any>) => {
        const completedCount = patientList?.filter((patient) => patient.referalstatus === "Completed").length || 0;
        const rejectedCount = patientList?.filter((patient) => patient.referalstatus === "Rejected").length || 0;
        const totalCount = patientList?.length || 0;

   
        return {
            completed: completedCount,
            rejected: rejectedCount,
            total: totalCount
        };
    };

    const referralStatusCounts = calculateReferralStatus(patientGraphData?.patientList || []);

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#333333',
                bodyColor: '#333333',
                borderColor: '#dddddd',
                borderWidth: 1,
            },
        },
    };

    const uniqueColors = [
        '#9e0168', // Red-Violet
        '#33FF57', // Fresh Green
        '#0fffbe', // Mint
        '#FF33A1', // Fuchsia Pink
        '#FFD700', // Golden Yellow
    ];

    const data = {
        labels: ['Total Refers Placed', 'Total Refers Completed', 'Total Refers Rejected'],
        datasets: [
            {
                label: 'Referral Count',
                data: [referralStatusCounts.total, referralStatusCounts.completed, referralStatusCounts.rejected],
                backgroundColor: uniqueColors,
            },
        ],
    };

    const handleChartBack = () => {
        navigate('/dashboard');
    };

    const handleChartChange = (type: 'pie' | 'bar' | 'line') => {
        setChartType(type);
    };

    return (
        <div className='chart-container'>
            <div className='chart-heading'>
                <h6 onClick={handleChartBack}><span className='back-icon'><IoIosArrowBack /></span><span>Chart Data</span></h6>
            </div>

            <div className='chart-options'>
                <button onClick={() => handleChartChange('pie')} className={chartType === 'pie' ? 'active' : ''}>Pie</button>
                <button onClick={() => handleChartChange('bar')} className={chartType === 'bar' ? 'active' : ''}>Bar</button>
                <button onClick={() => handleChartChange('line')} className={chartType === 'line' ? 'active' : ''}>Line</button>
            </div>

            <div className="chart">
                {chartType === 'pie' && <Pie options={options} data={data} />}
                {chartType === 'bar' && <Bar options={options} data={data} />}
                {chartType === 'line' && <Line options={options} data={data} />}
            </div>
        </div>
    );
};

export default Graph;
