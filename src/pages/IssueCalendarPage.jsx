import React, {useState, useEffect} from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styled from "styled-components";
import {FaSyringe, FaUserSecret, FaFire, FaExclamationTriangle} from "react-icons/fa";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend} from 'recharts';
import {format, parseISO} from 'date-fns';

const StyledCalendar = styled(Calendar)`
    width: 100%;
    font-size: 1.3rem;
    padding: 20px;

    .react-calendar__tile {
        height: 80px;
        padding: 10px;
    }

    .react-calendar__navigation {
        margin-bottom: 1rem;
    }

    .react-calendar__month-view__weekdays {
        font-weight: bold;
    }

    .react-calendar__tile--active {
        background: #006edc;
        color: white;
    }

    .react-calendar__tile--now {
        background: #e0f0ff;
    }
`;


const Wrapper = styled.div`
    max-width: 1200px;
    margin: 60px auto;
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

const dummyEvents = [
    {date: '2025-01-08', title: "마약 밀수 적발", category: "마약"},
    {date: '2025-02-10', title: "방화 사건 발생", category: "방화"},
    {date: '2025-02-10', title: "성범죄 피의자 검거", category: "성범죄"},
    {date: '2025-03-15', title: "마약 유통 조직 검거", category: "마약"},
    {date: '2025-03-20', title: "방화 미수 사건", category: "방화"},
    {date: '2025-04-10', title: "성범죄 피의자 검거", category: "성범죄"},
    {date: '2025-04-15', title: "마약 유통 조직 검거", category: "마약"},
    {date: '2025-05-20', title: "방화 미수 사건", category: "방화"},
    {date: '2025-05-10', title: "성범죄 피의자 검거", category: "성범죄"},
    {date: '2025-06-15', title: "마약 유통 조직 검거", category: "마약"},
    {date: '2025-07-20', title: "방화 미수 사건", category: "방화"},
    {date: '2025-08-10', title: "성범죄 피의자 검거", category: "성범죄"},
    {date: '2025-09-15', title: "마약 유통 조직 검거", category: "마약"},
    {date: '2025-10-20', title: "방화 미수 사건", category: "방화"},
    {date: '2025-10-10', title: "성범죄 피의자 검거", category: "성범죄"},
    {date: '2025-11-15', title: "마약 유통 조직 검거", category: "마약"},
    {date: '2025-12-20', title: "방화 미수 사건", category: "방화"},
];

function getIcon(category) {
    switch (category) {
        case "마약":
            return <FaSyringe color="crimson"/>;
        case "성범죄":
            return <FaUserSecret color="orange"/>;
        case "방화":
            return <FaFire color="tomato"/>;
        default:
            return <FaExclamationTriangle color="gray"/>;
    }
}

function getCategoryMonthlyChartData(events) {
    const monthMap = {};
    events.forEach(({date, category}) => {
        const month = format(parseISO(date), 'M') + '월';
        if (!monthMap[month]) {
            monthMap[month] = {month, 마약: 0, 성범죄: 0, 방화: 0};
        }
        monthMap[month][category] += 1;
    });

    return Object.values(monthMap).sort((a, b) => parseInt(a.month) - parseInt(b.month));
}

export default function IssueCalendarPage() {
    const [value, setValue] = useState(new Date());
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);

    useEffect(() => {
        const selectedDateStr = format(value, 'yyyy-MM-dd');
        const selected = dummyEvents.filter(e => e.date === selectedDateStr);
        setSelectedDateEvents(selected);
    }, [value]);

    const lineChartData = getCategoryMonthlyChartData(dummyEvents);

    return (
        <Wrapper>
            <LeftPanel>
                <h2>📅 이슈 캘린더</h2>
                <StyledCalendar
                    onChange={setValue}
                    value={value}
                    tileContent={({date, view}) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const dayEvents = dummyEvents.filter(e => e.date === dateStr);
                        return dayEvents.length > 0 ? <span>🔴</span> : null;
                    }}
                    style={{width: "100%"}}
                />
                <EventList>
                    {selectedDateEvents.length > 0 ? (
                        selectedDateEvents.map((event, idx) => (
                            <EventItem key={idx}>
                                <Label>{getIcon(event.category)} {event.category}</Label>
                                <div>{event.title}</div>
                            </EventItem>
                        ))
                    ) : (
                        <p>이 날짜에는 등록된 이슈가 없습니다.</p>
                    )}
                </EventList>
            </LeftPanel>
            <RightPanel>
                <h3>📈 월별 이슈 추이</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={lineChartData} margin={{top: 20, right: 30, left: 20, bottom: 10}}
                              barCategoryGap={20}
                              stackOffset="sign">

                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="month"/>
                        <YAxis allowDecimals={false}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="마약" stackId="a" fill="#e74c3c"/>
                        <Bar dataKey="성범죄" stackId="a" fill="#f39c12"/>
                        <Bar dataKey="방화" stackId="a" fill="#3498db"/>
                    </BarChart>
                </ResponsiveContainer>
            </RightPanel>
        </Wrapper>
    );
}