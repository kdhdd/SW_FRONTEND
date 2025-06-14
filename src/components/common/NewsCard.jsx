import React, {useState} from "react";
import styled from "styled-components";
import {FaHeart, FaCommentDots} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";

export default function NewsCard({news, rank}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const parsedDate = new Date(news.pubDate);
    const isValidDate = !isNaN(parsedDate.getTime());
    return (
        <CardWrapper $background={news.imageUrl || "/src/assets/noImage.png"}>
            {isValidDate ? (
                <DateBadge>
                    <span className="day">{parsedDate.getDate()}</span>
                    <span className="month">
                            {parsedDate.toLocaleString("default", {month: "short"}).toUpperCase()}
                        </span>
                    <span className="year">{parsedDate.getFullYear()}</span>
                    {rank !== undefined && (
                        rank < 3 ? (
                            <CrownWrapper rank={rank}>
                                <FontAwesomeIcon icon={faCrown}/>
                                <RankNumber>{rank + 1}</RankNumber>
                            </CrownWrapper>
                        ) : (
                            <RankBadge>{rank + 1}</RankBadge>
                        )
                    )}

                </DateBadge>
            ) : (
                <span>날짜 없음</span>
            )}

            <SlidePanel>
                {menuOpen && (
                    <IconBar>
                        <IconGroup>
                            <FaHeart/>
                            <span>{news.likes}</span>
                        </IconGroup>
                        <IconGroup>
                            <FaCommentDots/>
                            <span>{news.commentCount}</span>
                        </IconGroup>
                    </IconBar>

                )}
                <ContentWrapper>
                    <MenuButton onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(!menuOpen);
                    }}>
                        <span/>
                    </MenuButton>
                    <Title dangerouslySetInnerHTML={{__html: news.title}}/>
                    <Text>{news.description?.replace(/<[^>]+>/g, "").slice(0, 100)}...</Text>
                </ContentWrapper>
            </SlidePanel>
        </CardWrapper>
    );
}

const CardWrapper = styled.div`
    position: relative;
    background-image: url(${props => props.$background || "/src/assets/noImage.png"});
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.2);
    width: 100%;
    min-width: 280px;
    height: 420px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    transition: all 0.4s ease-in-out;

`;
const DateBadge = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    background-color: #77d7b9;
    color: white;
    padding: 0.6em;
    text-align: center;
    z-index: 2;

    .day {
        font-weight: 700;
        font-size: 22px;
    }

    .month,
    .year {
        font-size: 11px;
    }
`;

const SlidePanel = styled.div.attrs({className: "slide-panel"})`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: white;
    transform: translateY(0);
    transition: transform 0.4s ease-in-out;
    z-index: 2;
`;

const IconBar = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #c2e9df;
    padding: 0.5em 0;

    svg {
        font-size: 1.2rem;
        color: #333;
    }
`;

const IconGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 4px; /* 아이콘과 숫자 사이 간격을 좁게 */
`;

const ContentWrapper = styled.div`
    padding: 1em;
    position: relative;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h3`
    font-size: 1.1rem;
    margin: 10px 0 6px;
    color: #222;
    //height: 2.6em;
`;

const Text = styled.p`
    font-size: 0.9rem;
    color: #444;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease;

    ${CardWrapper}:hover & {
        max-height: 100px;
    }
`;

const MenuButton = styled.div`
    position: absolute;
    top: 8px;
    right: 12px;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #666;
        position: relative;

        &::before,
        &::after {
            content: "";
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #666;
        }

        &::before {
            top: -8px;
        }

        &::after {
            top: 8px;
        }
    }
`;

const RankBadge = styled.div`
    position: absolute;
    top: 6px;
    right: -190px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #77d7b9;
    color: white;
    font-weight: bold;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`;

const CrownWrapper = styled.div`
    position: absolute;
    top: 10px;
    right: -185px;
    font-size: 40px;
    color: ${({rank}) =>
            rank === 0 ? "#ffd700" : rank === 1 ? "#c0c0c0" : "#cd7f32"};
    z-index: 3;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const RankNumber = styled.span`
    position: absolute;
    font-size: 20px;
    font-weight: bold;
    color: white;
    top: 6px;
    text-align: center;
    z-index: 4;
    pointer-events: none;
`;
