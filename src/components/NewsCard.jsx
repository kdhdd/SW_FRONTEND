import React, {useState} from "react";
import styled from "styled-components";
import {FaHeart, FaCommentDots, FaBookmark} from "react-icons/fa";

export default function NewsCard({news}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const parsedDate = new Date(news.pubDate);
    const isValidDate = !isNaN(parsedDate.getTime());

    return (
        <CardWrapper background={news.imageUrl}>
            <DateBadge>
                {isValidDate ? (
                    <>
                        <span className="day">{parsedDate.getDate()}</span>
                        <span
                            className="month">{parsedDate.toLocaleString("default", {month: "short"}).toUpperCase()}</span>
                        <span className="year">{parsedDate.getFullYear()}</span>
                    </>
                ) : (
                    <span>날짜 없음</span>
                )}
            </DateBadge>

            <SlidePanel>
                {menuOpen && (
                    <IconBar>
                        <FaBookmark/>
                        <span>{news.likes}</span>
                        <FaHeart/>
                        <span>{news.commentCount}</span>
                        <FaCommentDots/>
                    </IconBar>
                )}
                <ContentWrapper>
                    <MenuButton onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(!menuOpen);
                    }}>
                        <span/>
                    </MenuButton>
                    <Author>{news.author || "기자 없음"}</Author>
                    <Title dangerouslySetInnerHTML={{__html: news.title}}/>
                    <Text>{news.description?.replace(/<[^>]+>/g, "").slice(0, 100)}...</Text>
                </ContentWrapper>
            </SlidePanel>
        </CardWrapper>
    );
}

const CardWrapper = styled.div`
    position: relative;
    background-image: url(${props => props.background});
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

const ContentWrapper = styled.div`
    padding: 1em;
    position: relative;
    display: flex;
    flex-direction: column;
`;

const Author = styled.div`
    font-size: 13px;
    color: #555;
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