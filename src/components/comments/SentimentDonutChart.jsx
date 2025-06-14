import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

export default function SentimentDonutChart({ title, stats }) {
    const data = {
        labels: ['긍정', '부정', '중립'],
        datasets: [
            {
                data: [stats.positive, stats.negative, stats.neutral],
                backgroundColor: ['#4caf50', '#f44336', '#9e9e9e'],
            }
        ]
    };

    return (
        <div style={{ width: 220 }}>
            <h4>{title}</h4>
            <Doughnut data={data} />
        </div>
    );
}
