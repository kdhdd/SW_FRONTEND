import React from "react";
import styled from "styled-components";

export default function LikeButton({liked, count, onClick}) {
    return (
        <LikeButtonSection>
            <Button onClick={onClick} className={liked ? "liked" : ""}>
                {liked ? "❤️" : "🤍"} {count} 공감
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
    font-size: 1.3rem;
    cursor: pointer;
    font-weight: bold;
    color: #666;
    transition: transform 0.2s;

    &.liked {
        color: #e74c3c;
    }

    &:hover {
        transform: scale(1.1);
    }
`;