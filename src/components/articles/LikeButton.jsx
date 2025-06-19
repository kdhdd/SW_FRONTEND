import React from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as solidHeart} from "@fortawesome/free-solid-svg-icons";
import {faHeart as lightHeart} from "@fortawesome/free-regular-svg-icons";

export default function LikeButton({liked, count, onClick}) {
    return (
        <LikeButtonSection>
            <Button onClick={onClick} className={liked ? "liked" : ""}>
                <FontAwesomeIcon
                    icon={liked ? solidHeart : lightHeart}
                    style={{marginRight: "8px", color: liked ? "#FF6B6B" : "#999"}}
                />
                <span>{count} 공감</span>
            </Button>
        </LikeButtonSection>
    );
}

const LikeButtonSection = styled.div`
    margin: 30px 0 10px 0;
    display: flex;
    justify-content: flex-start; /* 왼쪽 정렬 */
`;
const Button = styled.button`
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    font-weight: bold;
    color: #666;
    transition: transform 0.2s;
    display: flex;
    align-items: center;

    &:hover {
        transform: scale(1.05);
    }

    &.liked span {
        color: #FF6B6B;
    }
`;
