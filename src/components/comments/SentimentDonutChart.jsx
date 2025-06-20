import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';
import styled from "styled-components";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function SentimentDonutChart({stats}) {
    const data = {
        labels: ['긍정', '부정', '중립'],
        datasets: [
            {
                data: [stats.positive, stats.negative, stats.neutral],
                backgroundColor: ['#4caf50', '#f44336', '#9e9e9e'],
                borderWidth: 2,
            }
        ]
    };

    const options = {
        plugins: {
            datalabels: {
                formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(0);
                    return percentage > 0 ? `${percentage}%` : "";
                },
                color: 'black',
                font: (context) => {
                    const chartWidth = context.chart.width;
                    return {
                        weight: 'bold',
                        size: chartWidth < 300 ? 12 : 16,
                    };
                },
            },
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 12,
                    padding: 20,
                    font: {
                        size: 14
                    }
                }
            }
        },
        maintainAspectRatio: false,
        cutout: '45%' // 도넛 두께
    };

    return (
        <ChartContainer>
            <Doughnut data={data} options={options}/>
        </ChartContainer>
    );
}

const ChartContainer = styled.div`
    width: 100%;
    max-width: 280px;
    height: 220px;
    @media (max-width: 768px) {
        width: 160px;
        flex: 1 1 45%;
        max-width: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
    }
    @media (max-width: 480px) {
        width: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
    }
`;
