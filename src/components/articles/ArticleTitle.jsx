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
    font-size: 1.8rem;
`;

const Meta = styled.div`
    margin-top: 8px;
    color: gray;
    font-size: 0.9rem;
`;