import React from "react";
import styled from "styled-components";

export default function ArticleTitle({title, date}) {
    return (
        <>
            <Title dangerouslySetInnerHTML={{__html: title}}/>
            <Meta>{date}</Meta>
        </>
    );
}

const Title = styled.h2`
    margin-top: 20px;
    font-size: clamp(1.3rem, 3vw, 1.8rem); /* ✅ 반응형 제목 크기 */
    font-weight: bold;
    line-height: 1.4;
`;

const Meta = styled.div`
    margin-top: 8px;
    color: gray;
    font-size: clamp(0.85rem, 2vw, 0.95rem); /* ✅ 반응형 날짜 크기 */
`;