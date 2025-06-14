import React from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp as solidThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp as regularThumbsUp} from "@fortawesome/free-regular-svg-icons";

export default function LikeButton({liked, count, onClick}) {
    return (
        <LikeButtonSection>
            <Button onClick={onClick} className={liked ? "liked" : ""}>
                <FontAwesomeIcon
                    icon={liked ? solidThumbsUp : regularThumbsUp}
                    style={{marginRight: "15px"}}
                />
                {count} 공감
            </Button>
        </LikeButtonSection>
    );
}

const LikeButtonSection = styled.div`
    margin: 30px 0 10px;
    display: flex;
    justify-content: center;
`;

const Button = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    font-weight: bold;
    color: #666;
    transition: transform 0.2s;

    &.liked {
        color: #1F294A;
    }

    &:hover {
        transform: scale(1.1);
    }
`;