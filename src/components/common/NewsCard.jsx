import React from "react";
import styled from "styled-components";
import {FaHeart, FaCommentDots} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";

export default function NewsCard({news, rank}) {
    const parsedDate = new Date(news.pubDate);
    return (
        <CardContainer>
            {/* Image Section */}
            <ImageSection $background={news.imageUrl || "/src/assets/noImage.png"}>
                {/* Rank Badge */}
                {rank !== undefined && (
                    <RankBadge $rank={rank}>
                        {rank < 3 ? (
                            <CrownContainer>
                                <StyledCrown icon={faCrown} $rank={rank}/>
                                <RankText>{rank + 1}</RankText>
                            </CrownContainer>
                        ) : (
                            <RankNumber>{rank + 1}</RankNumber>
                        )}
                    </RankBadge>
                )}
                
                {/* Gradient Overlay */}
                <ImageOverlay/>
            </ImageSection>

            {/* Content Section */}
            <ContentSection>
                {/* Header */}
                <CardHeader>
                    <DateText>
                        {parsedDate.toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                    </DateText>
                    <StatsContainer>
                        <StatItem>
                            <FaHeart/>
                            <span>{news.likes}</span>
                        </StatItem>
                        <StatItem>
                            <FaCommentDots/>
                            <span>{news.commentCount}</span>
                        </StatItem>
                    </StatsContainer>
                </CardHeader>

                {/* Title */}
                <Title dangerouslySetInnerHTML={{__html: news.title}}/>

                {/* Description */}
                <Description>
                    {news.description?.replace(/<[^>]+>/g, "").slice(0, 120)}...
                </Description>
            </ContentSection>
        </CardContainer>
    );
}

const CardContainer = styled.div`
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(15, 26, 37, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
        box-shadow: 0 16px 48px rgba(15, 26, 37, 0.12);
    }

    @media (max-width: 768px) {
        border-radius: 16px;
    }

    @media (max-width: 480px) {
        border-radius: 12px;
    }
`;

const ImageSection = styled.div`
    position: relative;
    height: 200px;
    background-image: url(${props => props.$background || "/src/assets/noImage.png"});
    background-size: cover;
    background-position: center;
    overflow: hidden;

    @media (max-width: 768px) {
        height: 160px;
    }

    @media (max-width: 480px) {
        height: 140px;
    }
`;

const ImageOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(
        to top,
        rgba(15, 26, 37, 0.8) 0%,
        rgba(15, 26, 37, 0.4) 50%,
        transparent 100%
    );
`;

const RankBadge = styled.div`
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 2;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 4px 16px rgba(15, 26, 37, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);

    @media (max-width: 768px) {
        top: 12px;
        left: 12px;
        padding: 6px;
    }
`;

const RankNumber = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
    color: white;
    font-weight: 600;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);

    @media (max-width: 768px) {
        width: 24px;
        height: 24px;
        font-size: 11px;
    }
`;

const CrownContainer = styled.div`
    position: relative;
    width: 28px;
    height: 28px;

    @media (max-width: 768px) {
        width: 24px;
        height: 24px;
    }
`;

const StyledCrown = styled(FontAwesomeIcon)`
    position: absolute;
    font-size: 32px;
    top: -10%;
    left: -14%;
    color: ${({$rank}) =>
            $rank === 0 ? "#FFD700" :
                    $rank === 1 ? "#C0C0C0" :
                            "#CD7F32"};
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));

    @media (max-width: 768px) {
        font-size: 28px;
    }
`;

const RankText = styled.span`
    position: absolute;
    top: calc(50% + 3px);
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    font-weight: 700;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    pointer-events: none;

    @media (max-width: 768px) {
        font-size: 11px;
    }
`;

const ContentSection = styled.div`
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        padding: 16px;
    }

    @media (max-width: 480px) {
        padding: 12px;
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    @media (max-width: 768px) {
        margin-bottom: 10px;
    }
`;

const DateText = styled.span`
    font-size: 13px;
    color: #666;
    font-weight: 500;
    background: #F8F9FA;
    padding: 4px 8px;
    border-radius: 6px;

    @media (max-width: 768px) {
        font-size: 12px;
        padding: 3px 6px;
    }
`;

const StatsContainer = styled.div`
    display: flex;
    gap: 12px;

    @media (max-width: 768px) {
        gap: 8px;
    }
`;

const StatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    color: #666;
    font-size: 12px;
    font-weight: 500;

    svg {
        color: #4A90E2;
        font-size: 14px;
    }

    @media (max-width: 768px) {
        font-size: 11px;
        gap: 3px;
        
        svg {
            font-size: 12px;
        }
    }
`;

const Title = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #0F1A25;
    line-height: 1.4;
    margin: 0 0 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 768px) {
        font-size: 14px;
        margin: 0 0 6px 0;
    }

    @media (max-width: 480px) {
        font-size: 13px;
        margin: 0 0 4px 0;
    }
`;

const Description = styled.p`
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;

    @media (max-width: 768px) {
        font-size: 12px;
        -webkit-line-clamp: 2;
    }

    @media (max-width: 480px) {
        font-size: 11px;
    }
`;

