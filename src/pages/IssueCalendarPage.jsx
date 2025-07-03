import React, {useState, useEffect} from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {useNavigate} from 'react-router-dom';
import styled, { keyframes } from "styled-components";
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

// 애니메이션 정의
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

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

    const isMobile = window.innerWidth <= 768;
    const itemsPerRow = isMobile ? 3 : payload.length;

    const rows = [];
    for (let i = 0; i < payload.length; i += itemsPerRow) {
        rows.push(payload.slice(i, i + itemsPerRow));
    }

    return (
        <LegendContainer>
            {rows.map((row, rowIndex) => (
                <LegendRow key={rowIndex}>
                    {row.map((entry, index) => (
                        <LegendItem key={index}>
                            <LegendColor style={{backgroundColor: entry.color}} />
                            <LegendText>
                                {getCategoryDisplay[entry.value] || entry.value}
                            </LegendText>
                        </LegendItem>
                    ))}
                </LegendRow>
            ))}
        </LegendContainer>
    );
};

const getIcon = (category) => {
    return {
        "drug": <FaSyringe color="#FF6B6B"/>,
        "sexCrime": <FaUserSecret color="#FFB347"/>,
        "fraud": <FaDollarSign color="#a29bfe"/>,
        "murder": <FaSkullCrossbones color="#d63031"/>,
        "arson": <FaFire color="#6FB1FC"/>,
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

        for (const [korCategory, yearlyData] of Object.entries(categoryConfig)) {
            const key = getCategoryKey(korCategory);
            if (yearlyData?.[year]?.[month]) {
                counts[key] += yearlyData[year][month];
            }
        }

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

        for (const [korCategory, yearlyData] of Object.entries(categoryConfig)) {
            const key = getCategoryKey(korCategory);
            if (yearlyData?.[year]) {
                for (const value of Object.values(yearlyData[year])) {
                    counts[key] += value;
                }
            }
        }

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
        <TooltipContainer style={{left, top: coordinate.y}}>
            <TooltipTitle>{label}</TooltipTitle>
            {sorted.map(({name, value, color}, idx) => (
                <TooltipItem key={idx} style={{color}}>
                    {name} : {value}건
                </TooltipItem>
            ))}
        </TooltipContainer>
    );
};

export default function IssueCalendarPage() {
    const navigate = useNavigate();
    const [value, setValue] = useState(new Date());
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);
    const [apiArticles, setApiArticles] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const CustomTick = ({x, y, payload, months}) => {
        const index = months.indexOf(payload.value);
        const [year, month] = payload.value.split("-");
        let label = `${parseInt(month)}월`;

        if (index === 0 || months[index - 1]?.split("-")[0] !== year) {
            label = `${year}년 ${parseInt(month)}월`;
        }

        return (
            <text x={x} y={y + 15} textAnchor="middle" fontSize={14} fill="#444444">
                {label}
            </text>
        );
    };

    useEffect(() => {
        const fetchByKeyword = async (keyword) => {
            const res = await fetch(`http://localhost:8000/article-service/news?keyword=${keyword}`);
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
        <PageWrapper>
            <BackgroundGradient />
            <ContentContainer>
                <MainContent>
                    <CalendarSection>
                        <SectionTitle>캘린더</SectionTitle>
                        <StyledCalendar
                            onChange={setValue}
                            value={value}
                            maxDate={new Date()}
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
                                    <IconContainer>
                                        <IconRow>
                                            {firstRow.map((key, i) => (
                                                <IconSpan key={`r1-${i}`}>{getIcon(key)}</IconSpan>
                                            ))}
                                        </IconRow>
                                        {secondRow.length > 0 && (
                                            <IconRow>
                                                {secondRow.map((key, i) => (
                                                    <IconSpan key={`r2-${i}`}>{getIcon(key)}</IconSpan>
                                                ))}
                                            </IconRow>
                                        )}
                                    </IconContainer>
                                );
                            }}
                        />
                    </CalendarSection>

                    <EventSection>
                        <SectionTitle>선택된 날짜의 이슈</SectionTitle>
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
                                        <EventLabel>
                                            {getIcon(key)} {getCategoryDisplay[key]} ({count}건)
                                        </EventLabel>
                                    </EventItem>
                                ))
                            ) : (
                                <EmptyMessage>이 날짜에는 등록된 이슈가 없습니다.</EmptyMessage>
                            )}
                        </EventList>
                    </EventSection>

                    <ChartSection>
                        <SectionTitle>📈 최근 6개월 이슈</SectionTitle>
                        <ChartContainer>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={monthlyData}
                                    barCategoryGap={0}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                    <XAxis
                                        dataKey="month"
                                        tick={<CustomTick months={monthlyData.map(d => d.month)}/>}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        allowDecimals={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{fill: '#444444'}}
                                    />
                                    <Tooltip content={<CustomTooltip/>}/>
                                    <Legend content={<CustomLegend/>}/>
                                    {barKeys.map(({key, color}) => (
                                        <Bar 
                                            key={key} 
                                            dataKey={key} 
                                            stackId="a" 
                                            fill={color} 
                                            barSize={40}
                                            isAnimationActive={false}
                                        >
                                            <LabelList
                                                dataKey={key}
                                                position="top"
                                                content={({value, x, y, width, height}) => {
                                                    if (isMobile) return null;
                                                    if (!value || height < 10) return null;
                                                    let fontSize = 12;
                                                    if (height < 25) fontSize = 8;
                                                    else if (height < 40) fontSize = 10;
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
                        </ChartContainer>
                    </ChartSection>

                    <ChartSection>
                        <SectionTitle>📊 최근 6년간 이슈</SectionTitle>
                        <ChartContainer>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={yearlyData}
                                    barCategoryGap={0}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                    <XAxis
                                        dataKey="year"
                                        tickFormatter={(tick) => `${tick}년`}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        allowDecimals={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{fill: '#444444'}}
                                    />
                                    <Tooltip content={<CustomTooltip/>}/>
                                    <Legend content={<CustomLegend/>}/>
                                    {barKeys.map(({key, color}) => (
                                        <Bar 
                                            key={key} 
                                            dataKey={key} 
                                            stackId="a" 
                                            fill={color} 
                                            barSize={40}
                                            isAnimationActive={false}
                                        >
                                            <LabelList
                                                dataKey={key}
                                                position="top"
                                                content={({value, x, y, width, height}) => {
                                                    if (isMobile) return null;
                                                    if (!value || height < 10) return null;
                                                    let fontSize = 12;
                                                    if (height < 25) fontSize = 8;
                                                    else if (height < 40) fontSize = 10;
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
                        </ChartContainer>
                    </ChartSection>
                </MainContent>
            </ContentContainer>
        </PageWrapper>
    );
}

// Styled Components
const PageWrapper = styled.div`
    width: 100%;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
`;

const BackgroundGradient = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    z-index: -1;
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 20px 60px;
    animation: ${fadeInUp} 0.8s ease-out;

    @media (max-width: 768px) {
        padding: 100px 16px 40px;
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 40px;
`;

const TitleSection = styled.div`
    h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #0F1A25;
        margin-bottom: 10px;

        @media (max-width: 768px) {
            font-size: 2rem;
        }
    }

    p {
        font-size: 1.1rem;
        color: #666;
        margin: 0;
    }
`;

const MainContent = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    align-items: start;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 25px;
    }
`;

const CalendarSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    border: 1px solid #e9ecef;
`;

const EventSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    border: 1px solid #e9ecef;
`;

const ChartSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    border: 1px solid #e9ecef;
    grid-column: 1 / -1;

    @media (max-width: 1024px) {
        grid-column: 1;
    }
`;

const SectionTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    color: #0F1A25;
    margin-bottom: 20px;
    text-align: center;
`;

const ChartContainer = styled.div`
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #e9ecef;
`;

const StyledCalendar = styled(Calendar)`
    width: 100%;
    border: none;
    font-family: 'Poppins', sans-serif;
    background: transparent;

    .react-calendar__navigation {
        background: #0F1A25;
        font-weight: 600;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding: 12px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
    }

    .react-calendar__navigation button {
        background: none !important;
        border: none !important;
        color: white;
        font-size: 1.1rem;
        transition: color 0.2s ease;
        padding: 6px 10px;
        border-radius: 0 !important;
        min-width: 32px;
        min-height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: none !important;
        outline: none !important;
        margin: 0;
        &:hover, &:focus, &:active {
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
            color: #4A90E2;
        }
    }

    .react-calendar__navigation__label {
        flex: 1;
        background: none !important;
        color: white;
        font-size: 1.3rem;
        font-weight: 600;
        text-align: center;
        margin: 0;
        padding: 0;
        border-radius: 0;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
    }

    .react-calendar__month-view__weekdays {
        text-align: center;
        font-weight: 600;
        background: #f8f9fa;
        color: #0F1A25;
        border-bottom: 1px solid #e9ecef;
        padding: 10px 0;
        font-size: 0.9rem;
    }

    .react-calendar__tile {
        padding: 0.8em 0;
        height: 80px;
        text-align: center;
        background: white;
        border: 1px solid #f0f0f0;
        font-size: 1rem;
        transition: background 0.2s ease;

        &:hover {
            background: #f8f9fa;
        }

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
        border-bottom: 3px solid #d35400;
        font-weight: 600;
        color: #d35400;
    }

    .react-calendar__tile--active {
        background: #0F1A25;
        color: white;
        border-radius: 8px;
    }

    .react-calendar__tile:disabled {
        background: #f8f9fa;
        color: #adb5bd;
        cursor: not-allowed;
    }
`;

const IconContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 4px;
    gap: 2px;
`;

const IconRow = styled.div`
    display: flex;
    gap: 2px;
    justify-content: center;
`;

const IconSpan = styled.span`
    font-size: 12px;
`;

const EventList = styled.div`
    margin-top: 15px;
`;

const EventItem = styled.div`
    margin-bottom: 10px;
    padding: 12px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    background: #f8f9fa;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #e9ecef;
        transform: translateX(3px);
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const EventLabel = styled.div`
    display: flex;
    align-items: center;
    font-weight: 500;
    color: #0F1A25;
    font-size: 0.95rem;

    svg {
        margin-right: 8px;
        font-size: 1rem;
    }
`;

const EmptyMessage = styled.p`
    text-align: center;
    color: #6c757d;
    font-style: italic;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px dashed #dee2e6;
    margin: 0;
`;

// Chart Styled Components
const LegendContainer = styled.div`
    text-align: center;
    margin-top: 10px;
`;

const LegendRow = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
    flex-wrap: wrap;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    margin: 0 10px;
`;

const LegendColor = styled.div`
    width: 12px;
    height: 12px;
    margin-right: 6px;
    border-radius: 2px;
`;

const LegendText = styled.span`
    font-size: 13px;
    font-weight: 500;
    color: #444444;
`;

const TooltipContainer = styled.div`
    position: absolute;
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    pointer-events: none;
    white-space: nowrap;
    border: 1px solid #e9ecef;
`;

const TooltipTitle = styled.p`
    font-weight: 600;
    margin-bottom: 6px;
    color: #0F1A25;
    font-size: 13px;
`;

const TooltipItem = styled.p`
    margin: 3px 0;
    font-size: 12px;
    font-weight: 500;
`;
