import React from "react";
import styled from "styled-components";
import {FaHeart, FaCommentDots} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";

export default function NewsCard({news, rank}) {
    const parsedDate = new Date(news.pubDate);
    return (
        <CardWrapper $background={news.imageUrl || "/src/assets/noImage.png"}>


            {rank !== undefined ? (
                rank < 3 ? (
                    <CrownWrapper $rank={rank}>
                        <CrownIconContainer>
                            <StyledCrownIcon icon={faCrown} $rank={rank}/>
                            <RankNumberInCrown>{rank + 1}</RankNumberInCrown>
                        </CrownIconContainer>
                    </CrownWrapper>
                ) : (
                    <CrownWrapper>
                        <RankBadge>{rank + 1}</RankBadge> {/* ✅ 초록색 동그라미 그대로! */}
                    </CrownWrapper>
                )
            ) : null}


            <SlidePanel>
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
                <ContentWrapper>
                    <TopHalf>
                        <FormattedDate>
                            {parsedDate.toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </FormattedDate>
                    </TopHalf>
                    <BottomHalf>
                        <Title dangerouslySetInnerHTML={{__html: news.title}}/>
                        <Text>{news.description?.replace(/<[^>]+>/g, "").slice(0, 100)}...</Text>
                    </BottomHalf>
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

    @media (max-width: 768px) {
        height: 360px;
    }

    @media (max-width: 480px) {
        height: 320px;
    }
`;

const FormattedDate = styled.div`
    font-size: 1rem;
    font-weight: bold;
    color: white;
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
    background-color: #3c3b3b;
    padding: 0.5em 0;

    svg {
        color: #fff;
    }

    @media (max-width: 480px) {
        padding: 0.4em 0.2em;
    }
`;

const IconGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    color: white;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const TopHalf = styled.div`
    background-color: #5a5959;
    padding: 0.8em 1em 0.6em 1em;
`;

const BottomHalf = styled.div`
    background-color: white;
    padding: 0.8em 1em;
    min-height: 4.2em; /* 고정 높이 (2줄 + 여백 고려) */
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Title = styled.h3`
    font-size: 1.1rem;
    color: #222;
    margin: 0.4em 0;
    line-height: 1.3em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 2.6em;

    @media (max-width: 768px) {
        font-size: 1rem;
    }

    @media (max-width: 480px) {
        font-size: 0.95rem;
    }
`;

const Text = styled.p`
    font-size: 0.9rem;
    color: #444;
    max-height: 1px;
    overflow: hidden;
    transition: max-height 0.4s ease;

    ${CardWrapper}:hover & {
        max-height: 100px;
    }

    @media (max-width: 768px) {
        font-size: 0.85rem;
    }

    @media (max-width: 480px) {
        font-size: 0.8rem;
    }
`;

const RankBadge = styled.div`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #454444;
    color: white;
    font-weight: bold;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CrownWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    background-color: white;
    padding: 0.6em;
    z-index: 2;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    /* ⬇️ 오른쪽 아래만 둥글게 */
    border-radius: 0 8px 8px 8px;
`;


const CrownIconContainer = styled.div`
    position: relative;
    width: 35px;
    height: 35px;
`;

const StyledCrownIcon = styled(FontAwesomeIcon)`
    position: absolute;
    font-size: 40px;
    top: -5%;
    left: -14%;
    color: ${({$rank}) =>
            $rank === 0 ? "#ffd700" :
                    $rank === 1 ? "#c0c0c0" :
                            "#cd7f32"};
`;

const RankNumberInCrown = styled.span`
    position: absolute;
    top: calc(50% + 5px);
    left: calc(50%);
    transform: translate(-50%, -50%);
    font-size: 20px;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    pointer-events: none;
`;

