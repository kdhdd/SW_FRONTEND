import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';

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
                font: {
                    weight: 'bold',
                    size: 16,
                },
            },
            legend: {
                position: 'top',
                labels: {
                    font: {size: 14}
                }
            }
        },
        maintainAspectRatio: false,
        cutout: '40%' // 도넛 두께 조절
    };

    return (
        <div style={{width: 220, height: 220}}>
            <Doughnut data={data} options={options}/>
        </div>
    );
}
