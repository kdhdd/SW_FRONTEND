import React, {useState, useEffect} from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";
import {CATEGORY_CONFIG} from "../data/dummyArticles"; // 경로는 실제 위치에 따라 조정
import {
    FaSyringe, FaUserSecret, FaFire,
    FaDollarSign, FaSkullCrossbones, FaHandRock
} from "react-icons/fa";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Legend, LabelList
} from "recharts";
import {format} from "date-fns";

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

const CustomLegend = ({payload}) => {
    if (!payload) return null;

    const itemsPerRow = 3;
    const rows = [];

    for (let i = 0; i < payload.length; i += itemsPerRow) {
        rows.push(payload.slice(i, i + itemsPerRow));
    }

    return (
        <div style={{textAlign: "center", marginTop: 10}}>
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} style={{display: "flex", justifyContent: "center", marginBottom: 4}}>
                    {row.map((entry, index) => (
                        <div key={index} style={{display: "flex", alignItems: "center", margin: "0 10px"}}>
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: entry.color,
                                    marginRight: 6,
                                    borderRadius: 2,
                                }}
                            />
                            <span style={{fontSize: 12}}>
                {getCategoryDisplay[entry.value] || entry.value}
              </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};


const getIcon = (category) => {
    return {
        "drug": <FaSyringe color="crimson"/>,
        "sexCrime": <FaUserSecret color="orange"/>,
        "fraud": <FaDollarSign color="#a29bfe"/>,
        "murder": <FaSkullCrossbones color="#d63031"/>,
        "arson": <FaFire color="tomato"/>,
        "violence": <FaHandRock color="#2d3436"/>
    }[category];
};

const getCategoryDisplay = {
    drug: "마약",
    sexCrime: "성폭행",
    fraud: "사기",
    murder: "살인",
    arson: "방화",
    violence: "폭행"
};

const barKeys = [
    {key: "drug", color: "#FF6B6B"},
    {key: "sexCrime", color: "#FFB347"},
    {key: "fraud", color: "#a29bfe"},
    {key: "murder", color: "#d63031"},
    {key: "arson", color: "#6FB1FC"},
    {key: "violence", color: "#2d3436"}
];

const getMonthlyDataWithApi = (categoryConfig, apiArticles) => {
    const now = new Date();
    const baseMonths = Array.from({length: 6}, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return format(date, "yyyy-MM");
    });

    return baseMonths.map(monthStr => {
        const [year, month] = monthStr.split("-").map(Number);
        const counts = {month: monthStr, drug: 0, sexCrime: 0, fraud: 0, murder: 0, arson: 0, violence: 0};

        // ✅ 더미 숫자
        for (const [korCategory, yearlyData] of Object.entries(categoryConfig)) {
            const key = getCategoryKey(korCategory);
            if (yearlyData?.[year]?.[month]) {
                counts[key] += yearlyData[year][month];
            }
        }

        // ✅ API 기사에서 개수 세기
        apiArticles.forEach(({date, category}) => {
            if (format(new Date(date), "yyyy-MM") === monthStr) {
                const key = getCategoryKey(category);
                if (key) counts[key]++;
            }
        });

        return counts;
    });
};


const getYearlyDataWithApi = (categoryConfig, apiArticles) => {
    const now = new Date();
    const baseYears = Array.from({length: 6}, (_, i) => now.getFullYear() - 5 + i);

    return baseYears.map(year => {
        const counts = {year: `${year}`, drug: 0, sexCrime: 0, fraud: 0, murder: 0, arson: 0, violence: 0};

        // ✅ 더미 숫자
        for (const [korCategory, yearlyData] of Object.entries(categoryConfig)) {
            const key = getCategoryKey(korCategory);
            if (yearlyData?.[year]) {
                for (const value of Object.values(yearlyData[year])) {
                    counts[key] += value;
                }
            }
        }

        // ✅ API 기사 집계
        apiArticles.forEach(({date, category}) => {
            if (format(new Date(date), "yyyy") === String(year)) {
                const key = getCategoryKey(category);
                if (key) counts[key]++;
            }
        });

        return counts;
    });
};


const CustomTooltip = ({active, payload, label, coordinate, viewBox}) => {
    if (!active || !payload || payload.length === 0) return null;
    const chartWidth = viewBox.width;
    const isRight = coordinate.x > chartWidth * 0.75;
    const left = isRight ? coordinate.x - 140 : coordinate.x + 40;

    const sorted = [...barKeys].reverse().map(({key, color}) => {
        const found = payload.find(p => p.dataKey === key);
        return found ? {name: getCategoryDisplay[key], value: found.value, color} : null;
    }).filter(Boolean);

    return (
        <div style={{
            position: 'absolute',
            left, top: coordinate.y,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
        }}>
            <p style={{fontWeight: "bold", marginBottom: 6}}>{label}</p>
            {sorted.map(({name, value, color}, idx) => (
                <p key={idx} style={{color, margin: 0}}>{name} : {value}건</p>
            ))}
        </div>
    );
};

export default function IssueCalendarPage() {
    const navigate = useNavigate();
    const [value, setValue] = useState(new Date());
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);
    const [apiArticles, setApiArticles] = useState([]);

    const CustomTick = ({x, y, payload, months}) => {
        const index = months.indexOf(payload.value);
        const [year, month] = payload.value.split("-");
        let label = `${parseInt(month)}월`;

        if (index === 0 || months[index - 1]?.split("-")[0] !== year) {
            label = `${year}년 ${parseInt(month)}월`;
        }

        return (
            <text x={x} y={y + 15} textAnchor="middle" fontSize={16} fill="#333">
                {label}
            </text>
        );
    };

    useEffect(() => {
        const fetchByKeyword = async (keyword) => {
            const res = await fetch(`https://crimearticle.net/article-service/news?keyword=${keyword}`);
            const json = await res.json();
            const data = (json.data ?? []).filter(a => a?.title && a?.pubDate);
            return data.map(({pubDate, title}) => ({
                date: format(new Date(pubDate), "yyyy-MM-dd"),
                category: keyword,
                title: title.replace(/<[^>]*>?/g, "")
            }));
        };

        const fetchAll = async () => {
            const keywords = ["마약", "성폭행", "사기", "살인", "방화", "폭행"];
            const results = await Promise.all(keywords.map(fetchByKeyword));
            const all = results.flat();
            setApiArticles(all);
        };

        fetchAll();
    }, []);


    useEffect(() => {
        const selectedStr = format(value, "yyyy-MM-dd");
        setSelectedDateEvents(apiArticles.filter(e => e.date === selectedStr));
    }, [value, apiArticles]);


    const monthlyData = getMonthlyDataWithApi(CATEGORY_CONFIG, apiArticles);
    const yearlyData = getYearlyDataWithApi(CATEGORY_CONFIG, apiArticles);


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
                        const dayEvents = apiArticles.filter(e => e.date === dateStr);

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
                            selectedDateEvents.reduce((acc, e) => {
                                const key = getCategoryKey(e.category);
                                acc[key] = (acc[key] || 0) + 1;
                                return acc;
                            }, {})
                        ).map(([key, count]) => (
                            <EventItem key={key} onClick={() =>
                                navigate(`/search-result?keyword=${getCategoryDisplay[key]}&date=${format(value, 'yyyy-MM-dd')}`)
                            }>
                                <Label>{getIcon(key)} {getCategoryDisplay[key]} ({count}건)</Label>
                            </EventItem>
                        ))
                    ) : (
                        <p>이 날짜에는 등록된 이슈가 없습니다.</p>
                    )}
                </EventList>

            </LeftPanel>
            <RightPanel>
                <h3>📈 최근 6개월 이슈</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={monthlyData}
                        barCategoryGap={0}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="month"
                            tick={<CustomTick months={monthlyData.map(d => d.month)}/>}
                        />

                        <YAxis allowDecimals={false}/>
                        <Tooltip content={<CustomTooltip/>}/>

                        <Legend content={<CustomLegend/>}/>

                        {barKeys.map(({key, color}) => (
                            <Bar key={key} dataKey={key} stackId="a" fill={color} barSize={44}
                                 isAnimationActive={false}>
                                <LabelList
                                    dataKey={key}
                                    position="top"
                                    content={({value, x, y, width, height}) => {
                                        if (!value || height < 15) return null;  // 막대 높이가 너무 작으면 표시 안 함
                                        const fontSize = height < 40 ? 11 : 13;
                                        return (
                                            <text
                                                x={x + width / 2}
                                                y={y + height / 2 + 4}
                                                fill="white"
                                                fontSize={fontSize}
                                                fontWeight="bold"
                                                textAnchor="middle"
                                            >
                                                {`${value}건`}
                                            </text>
                                        );
                                    }}

                                />

                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>

                <h3 style={{marginTop: "50px"}}>📊 최근 6년간 이슈</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={yearlyData}
                        barCategoryGap={0}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="year"
                            tickFormatter={(tick) => `${tick}년`}
                        />
                        <YAxis allowDecimals={false}/>
                        <Tooltip content={<CustomTooltip/>}/>

                        <Legend content={<CustomLegend/>}/>

                        {barKeys.map(({key, color}) => (
                            <Bar key={key} dataKey={key} stackId="a" fill={color} barSize={44}
                                 isAnimationActive={false}>
                                <LabelList
                                    dataKey={key}
                                    position="top"
                                    content={({value, x, y, width, height}) => {
                                        if (!value || height < 15) return null;  // 막대 높이가 너무 작으면 표시 안 함
                                        const fontSize = height < 40 ? 11 : 13;
                                        return (
                                            <text
                                                x={x + width / 2}
                                                y={y + height / 2 + 4}
                                                fill="white"
                                                fontSize={fontSize}
                                                fontWeight="bold"
                                                textAnchor="middle"
                                            >
                                                {`${value}건`}
                                            </text>
                                        );
                                    }}
                                />
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
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
        color: white;
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

        @media (max-width: 768px) {
            height: 100px;
            font-size: 0.85rem;
        }
        @media (max-width: 480px) {
            height: 70px;
            font-size: 0.75rem;
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

    @media (max-width: 1024px) {
        flex-direction: column;
        gap: 30px;
        padding: 16px;
    }

    @media (max-width: 480px) {
        padding: 12px;
        margin: 60px auto;
    }
`;

const LeftPanel = styled.div`
    flex: 1;
    min-width: 600px;

    @media (max-width: 1024px) {
        min-width: 100%;
    }

    @media (max-width: 480px) {
        width: 100%;
    }
`;

const RightPanel = styled.div`
    flex: 1;

    h3 {
        font-size: 1.2rem;

        @media (max-width: 768px) {
            font-size: 1rem;
            text-align: center;
        }
    }

    @media (max-width: 768px) {
        width: 100%;
        padding: 0;
    }
`;

const EventList = styled.div`
    margin-top: 30px;
    font-size: 1rem;

    @media (max-width: 768px) {
        font-size: 0.95rem;
    }
    @media (max-width: 480px) {
        font-size: 0.9rem;
    }
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

    @media (max-width: 480px) {
        font-size: 0.9rem;
    }
`;
