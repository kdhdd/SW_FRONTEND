import React, {useState} from "react";
import styled from "styled-components";
import {FaHeart, FaCommentDots} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";

export default function NewsCard({news, rank}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const parsedDate = new Date(news.pubDate);
    return (
        <CardWrapper $background={news.imageUrl || "/src/assets/noImage.png"}>


            {rank !== undefined ? (
                rank < 3 ? (
                    <CrownWrapper rank={rank}>
                        <CrownIconContainer>
                            <StyledCrownIcon icon={faCrown} rank={rank}/>
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

`;

const FormattedDate = styled.div`
    font-size: 1rem;
    font-weight: bold;
    color: #222;
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
    gap: 4px;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const TopHalf = styled.div`
    background-color: #e2faf6;
    padding: 0.8em 1em 0.6em 1em;
`;

const BottomHalf = styled.div`
    background-color: white;
    padding: 0.8em 1em;
`;

const Title = styled.h3`
    font-size: 1.1rem;
    margin: 5px 0 6px;
    color: #222;
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
    color: ${({rank}) =>
            rank === 0 ? "#ffd700" : rank === 1 ? "#c0c0c0" : "#cd7f32"};
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

