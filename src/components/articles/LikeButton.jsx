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
    justify-content: flex-start;

    @media (max-width: 480px) {
        margin: 24px 0 8px;
    }
`;

const Button = styled.button`
    background: none;
    border: none;
    font-size: clamp(1rem, 2.5vw, 1.2rem); /* ✅ 반응형 글자 크기 */
    cursor: pointer;
    font-weight: bold;
    color: #666;
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    padding: 0.3rem 0.5rem;

    &:hover {
        transform: scale(1.05);
    }

    &.liked span {
        color: #FF6B6B;
    }

    svg {
        font-size: 1.2em;
        margin-right: 6px;

        @media (max-width: 480px) {
            margin-right: 4px;
        }
    }

    span {
        white-space: nowrap;
    }
`;