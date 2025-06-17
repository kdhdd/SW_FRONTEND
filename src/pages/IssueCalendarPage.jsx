import React, {useState, useEffect} from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";
import {
    FaSyringe, FaUserSecret, FaFire,
    FaDollarSign, FaSkullCrossbones,
    FaHandRock
} from "react-icons/fa";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LabelList} from 'recharts';
import {format, parseISO} from 'date-fns';

function getCategoryKey(category) {
    switch (category) {
        case "마약":
            return "drug";
        case "성폭행":
            return "sexCrime";
        case "사기":
            return "fraud";
        case "살인":
            return "murder";
        case "방화":
            return "arson";
        case "폭행":
            return "violence";
    }
}


function getIcon(category) {
    switch (category) {
        case "drug":
            return <FaSyringe color="crimson"/>;

        case "sexCrime":
            return <FaUserSecret color="orange"/>;

        case "fraud":
            return <FaDollarSign color="#a29bfe"/>; // or FaBriefcase

        case "murder":
            return <FaSkullCrossbones color="#d63031"/>; // or FaUserSlash

        case "arson":
            return <FaFire color="tomato"/>;

        case "violence":
            return <FaHandRock color="#2d3436"/>; // or FaFistRaised
    }
}


function getCategoryMonthlyChartData(events) {
    const baseMonths = Array.from({length: 12}, (_, i) => ({
        month: `${i + 1}월`,
        drug: 0,
        sexCrime: 0,
        fraud: 0,
        murder: 0,
        arson: 0,
        violence: 0
    }));

    const monthMap = {};
    events.forEach(({date, category}) => {
        const month = format(parseISO(date), 'M') + '월';
        if (!monthMap[month]) {
            monthMap[month] = {
                month,
                drug: 0,
                sexCrime: 0,
                fraud: 0,
                murder: 0,
                arson: 0,
                violence: 0
            };
        }
        const key = getCategoryKey(category);
        if (monthMap[month][key] !== undefined) {
            monthMap[month][key] += 1;
        }
    });
    const filled = baseMonths.map(base => ({
        ...base,
        ...(monthMap[base.month] || {})  // 실제 데이터 덮어쓰기
    }));

    return filled;
}

export default function IssueCalendarPage() {
    const navigate = useNavigate();
    const [value, setValue] = useState(new Date());
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);

    const [articles, setArticles] = useState([]);

    const categoryDisplayMap = {
        drug: "마약",
        sexCrime: "성폭행",
        fraud: "사기",
        murder: "살인",
        arson: "방화",
        violence: "폭행"
    };

    const barKeys = [
        {key: 'drug', color: '#FF6B6B'},
        {key: 'sexCrime', color: '#FFB347'},
        {key: 'fraud', color: '#a29bfe'},
        {key: 'murder', color: '#d63031'},
        {key: 'arson', color: '#6FB1FC'},
        {key: 'violence', color: '#2d3436'}
    ];

    const CustomTooltip = ({active, payload, label}) => {
        if (!active || !payload || payload.length === 0) return null;

        // barKeys의 역순 정렬
        const sorted = [...barKeys].reverse().map(({key, color}) => {
            const match = payload.find(p => p.dataKey === key);
            return match ? {
                name: categoryDisplayMap[key],
                value: match.value,
                color
            } : null;
        }).filter(Boolean);

        return (
            <div style={{backgroundColor: 'white', padding: 10, borderRadius: 8}}>
                <p><strong>{label}</strong></p>
                {sorted.map(({name, value, color}, idx) => (
                    <p key={idx} style={{color, margin: 0}}>{name} : {value}건</p>
                ))}
            </div>
        );
    };

    useEffect(() => {
        const fetchByKeyword = async (keyword) => {
            const res = await fetch(`https://crimearticle.net/article-service/news?keyword=${keyword}`);
            const json = await res.json();
            const data = (json.data ?? []).filter(article => article && article.title && article.pubDate);
            return data.map(article => {
                const dateObj = new Date(article.pubDate);
                const date = format(dateObj, "yyyy-MM-dd");
                const title = article.title.replace(/<[^>]*>?/g, '');
                return {date, category: keyword, title};
            });
        };


        const fetchAll = async () => {
            try {
                const [drugArticles,
                    sexCrimeArticles,
                    fraudArticles,
                    murderArticles,
                    arsonArticles,
                    violenceArticles] = await Promise.all([
                    fetchByKeyword("마약"),
                    fetchByKeyword("성폭행"),
                    fetchByKeyword("사기"),
                    fetchByKeyword("살인"),
                    fetchByKeyword("방화"),
                    fetchByKeyword("폭행")
                ]);
                setArticles([
                    ...drugArticles,
                    ...sexCrimeArticles,
                    ...fraudArticles,
                    ...murderArticles,
                    ...arsonArticles,
                    ...violenceArticles
                ]);
            } catch (error) {
                console.error("기사 불러오기 실패:", error);
            }
        };

        fetchAll();
    }, []);


    useEffect(() => {
        const buttons = document.querySelectorAll('.react-calendar__navigation button');
        const handleMouseDown = (e) => {
            e.preventDefault();
            e.currentTarget.blur();
        };
        buttons.forEach(button => button.addEventListener('mousedown', handleMouseDown));
        return () => {
            buttons.forEach(button => button.removeEventListener('mousedown', handleMouseDown));
        };
    }, []);

    useEffect(() => {
        const selectedDateStr = format(value, 'yyyy-MM-dd');
        const selected = articles.filter(e => e.date === selectedDateStr);
        setSelectedDateEvents(selected);
    }, [value, articles]);

    const lineChartData = getCategoryMonthlyChartData(articles);

    const firstHalfData = lineChartData.filter(item => {
        const month = parseInt(item.month);
        return month >= 1 && month <= 6;
    });

    const secondHalfData = lineChartData.filter(item => {
        const month = parseInt(item.month);
        return month >= 7 && month <= 12;
    });
    return (
        <Wrapper>
            <LeftPanel>
                <h2>📅 이슈 캘린더</h2>
                <StyledCalendar
                    onChange={setValue}
                    value={value}
                    maxDate={new Date()} // ✅ 선택 제한은 오늘까지
                    navigationLabel={({date}) =>
                        format(date, 'yyyy년 M월')
                    }
                    tileDisabled={({date}) => date > new Date()}
                    tileContent={({date}) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const dayEvents = articles.filter(e => e.date === dateStr);

                        const uniqueCategories = Array.from(
                            new Set(dayEvents.map(e => getCategoryKey(e.category)))
                        );

                        const firstRow = uniqueCategories.slice(0, 3);
                        const secondRow = uniqueCategories.slice(3, 6);

                        return (
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: 4}}>
                                <div style={{display: "flex", gap: "2px"}}>
                                    {firstRow.map((key, i) => (
                                        <span key={`r1-${i}`} style={{fontSize: 13}}>{getIcon(key)}</span>
                                    ))}
                                </div>
                                {secondRow.length > 0 && (
                                    <div style={{display: "flex", gap: "2px", marginTop: 2}}>
                                        {secondRow.map((key, i) => (
                                            <span key={`r2-${i}`} style={{fontSize: 13}}>{getIcon(key)}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }}

                />

                <EventList>
                    {selectedDateEvents.length > 0 ? (
                        Object.entries(
                            selectedDateEvents.reduce((acc, event) => {
                                const key = getCategoryKey(event.category);
                                acc[key] = acc[key] ? acc[key] + 1 : 1;
                                return acc;
                            }, {})
                        ).map(([key, count]) => (
                            <EventItem key={key} onClick={() =>
                                navigate(`/search-result?keyword=${categoryDisplayMap[key]}&date=${format(value, 'yyyy-MM-dd')}`)
                            }>
                                <Label>
                                    {getIcon(key)} {categoryDisplayMap[key]} ({count}건)
                                </Label>
                            </EventItem>

                        ))
                    ) : (
                        <p>이 날짜에는 등록된 이슈가 없습니다.</p>
                    )}
                </EventList>

            </LeftPanel>
            <RightPanel>
                <h3>📈 월별 이슈 추이</h3>

                <div style={{display: "flex", flexDirection: "column", gap: "40px"}}>
                    {/* 전반기 */}
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={firstHalfData} barCategoryGap={0}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="month"/>
                            <YAxis allowDecimals={false}/>
                            <Tooltip content={<CustomTooltip/>}/>
                            <Legend formatter={(value) => categoryDisplayMap[value]}/>

                            {barKeys.map(({key, color}) => (
                                <Bar key={key} dataKey={key} stackId="a" fill={color} barSize={44}>
                                    <LabelList
                                        dataKey={key}
                                        position="insideTop"
                                        formatter={(value) => value > 0 ? `${value}건` : ''}
                                        style={{
                                            fill: 'white',
                                            fontWeight: 'bold',
                                            fontSize: 12
                                        }}
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>

                    {/* 후반기 */}
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={secondHalfData} barCategoryGap={0}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="month"/>
                            <YAxis allowDecimals={false}/>
                            <Tooltip content={<CustomTooltip/>}/>
                            <Legend formatter={(value) => categoryDisplayMap[value]}/>

                            {barKeys.map(({key, color}) => (
                                <Bar key={key} dataKey={key} stackId="a" fill={color} barSize={44}>
                                    <LabelList
                                        dataKey={key}
                                        position="insideTop"
                                        formatter={(value) => value > 0 ? `${value}건` : ''}
                                        style={{
                                            fill: 'white',
                                            fontWeight: 'bold',
                                            fontSize: 12
                                        }}
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </RightPanel>

        </Wrapper>
    );
}

const StyledCalendar = styled(Calendar)`
    width: 100%;
    border: none;
    font-family: 'Noto Sans KR', sans-serif;

    .react-calendar__navigation {
        background-color: #333;
        font-weight: bold;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    .react-calendar__navigation button {
        background: none;
        border: none;
        color: white; /* 기본 상태 */
        font-size: 1.2rem;
        transition: color 0.2s ease;
    }


    .react-calendar__month-view__weekdays {
        text-align: center;
        font-weight: bold;
        background: white;
        color: black;
        border-bottom: 1px solid #ddd;
    }

    .react-calendar__tile {
        padding: 0.8em 0;
        height: 80px;
        text-align: center;
        background-color: white;
        border: 1px solid #eee;
        font-size: 1rem;
    }

    .react-calendar__month-view__days__day--weekend {
        color: #4169e1;

        &:nth-child(7n) {
            color: #FF7A00;
        }
    }

    .react-calendar__tile--now {
        background: #fff4ec;
        border-bottom: 4px solid #d35400;
        font-weight: bold;
    }

    .react-calendar__tile--active {
        background: #222;
        color: white;
        border-radius: 6px;
    }

    .react-calendar__month-view__days__day--neighboringMonth {
        visibility: hidden;
    }

    .react-calendar__tile:disabled {
        background-color: #f3f3f3;
        color: #ccc;
        cursor: not-allowed;
    }
`;

const Wrapper = styled.div`
    max-width: 1200px;
    margin: 100px auto;
    padding: 20px;
    display: flex;
    gap: 40px;
`;

const LeftPanel = styled.div`
    flex: 1;
    min-width: 600px; // ← 캘린더 전체 너비 확보
`;


const RightPanel = styled.div`
    flex: 1;
`;

const EventList = styled.div`
    margin-top: 30px;
`;

const EventItem = styled.div`
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #f9f9f9;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: #f1f1f1;
    }
`;


const Label = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 5px;

    svg {
        margin-right: 6px;
    }
`;
