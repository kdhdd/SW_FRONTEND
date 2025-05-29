import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function NewsList() {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch("http://localhost:8080/news");
                const data = await res.json();
                setArticles(data);
            } catch (err) {
                console.error("뉴스 불러오기 실패:", err);
            }
        };
        fetchNews();
    }, []);

    return (
        <Grid>
            {articles.map((article, index) => (
                <Card key={index} onClick={() => navigate(`/articles/${index}`)}>
                    <Image src={article.imageUrl} alt="썸네일" />
                    <Title dangerouslySetInnerHTML={{ __html: article.thumbnailTitle }} />
                    <Content>{article.thumbnailContent.replace(/<[^>]+>/g, "").slice(0, 100)}...</Content>
                </Card>
            ))}
        </Grid>
    );
}
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 40px;
`;

const Card = styled.div`
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const Title = styled.h3`
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
`;

const Content = styled.p`
  padding: 0 12px 12px;
  font-size: 0.9rem;
  color: #555;
`;
