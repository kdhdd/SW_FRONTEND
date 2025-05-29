import {useEffect, useState} from "react";
import ScrollReveal from "scrollreveal";
import styled from "styled-components";
import homeVideo from "/src/assets/home.mp4";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [date, setDate] = useState("");

  const searchNews = (keyword, date) => {
    console.log("검색:", keyword, date);
    // 👉 여기에 fetch 로직 넣을 수 있음
  };

  useEffect(() => {
    ScrollReveal().reveal(".text", { delay: 200, origin: "top" });
    ScrollReveal().reveal(".form-container", { delay: 400, origin: "left" });
  }, []);

  return (
      <HomeSection id="home">
        <BgVideo autoPlay muted loop playsInline>
          <source src={homeVideo} type="video/mp4" />
          <img src="/src/assets/main.png" alt="" />
        </BgVideo>

        <IntroText>
          <h1>실시간 기사와 인기 순위,</h1>
          <h1>경찰과 시민이 나눈 생생한 의견까지 한자리에</h1>
          <h2>오늘의 뉴스</h2>
        </IntroText>

        <Text>
          <h1><span>눈앞에서 펼쳐지는 현장</span></h1>
          <p>지금 이 순간, 현장에 접속하다</p>
        </Text>

        <SearchBar>
          <div className="search-input-group">
            <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button onClick={() => searchNews(keyword, date)}>🔍</button>
          </div>

          <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
          />
        </SearchBar>
        <PopularArticles>
          <h2>🔥 실시간 인기 뉴스</h2>
          <div className="article-grid">
            <div className="article-item"><span className="rank">1</span><span className="title">이재명, 서울 어린이대공원 맹비난</span><span className="count">224건</span></div>
            <div className="article-item"><span className="rank">6</span><span className="title">진주시, 친환경 스타트업 투자</span><span className="count">51건</span></div>
            <div className="article-item"><span className="rank">2</span><span className="title">전남도 미래차 산업 전환</span><span className="count">61건</span></div>
            <div className="article-item"><span className="rank">7</span><span className="title">김문수, PKTK 결집 총력</span><span className="count">40건</span></div>
            <div className="article-item"><span className="rank">3</span><span className="title">사전투표 시작, 지자체 점검</span><span className="count">57건</span></div>
            <div className="article-item"><span className="rank">8</span><span className="title">SK이노베이션 CEO 교체</span><span className="count">36건</span></div>
            <div className="article-item"><span className="rank">4</span><span className="title">현대글로비스 우수기업 선정</span><span className="count">57건</span></div>
            <div className="article-item"><span className="rank">9</span><span className="title">대한항공, 무인 수상정 편대</span><span className="count">34건</span></div>
            <div className="article-item"><span className="rank">5</span><span className="title">이준석 여성 신체표현 논란</span><span className="count">55건</span></div>
            <div className="article-item"><span className="rank">10</span><span className="title">이재명·김문수 맞불, 오차범위 접전</span><span className="count">33건</span></div>
          </div>
        </PopularArticles>


      </HomeSection>
  );
}

// styled-components
const HomeSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: grid;
  align-items: start;
  grid-template-columns: 1fr 1fr 0.8fr; /* 3개의 컬럼 */
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr; /* 모바일에서는 한 열 */
  }
`;

/* 비디오를 화면 뒤에 꽉 채워 깔아두기 */
const BgVideo = styled.video`
  position: absolute;
  inset: 0;           /* top:0; right:0; bottom:0; left:0; */
  width: 100%;
  height: 100%;
  object-fit: cover;  /* 이미지 background-size: cover 같은 효과 */
  z-index: -1;        /* 나머지 콘텐츠 뒤로 */
`;

const Text = styled.div.attrs({ className: "text" })`
  h1 {
    font-size: 2.5rem;
    letter-spacing: 2px;
    span {
      color: var(--main-color);
    }
  }
  p {
    margin: 0.5rem 0 1rem;
    font-size: 1rem;
  }

  /* 반응형 부분도 그대로 옮겨줍니다 */
  @media (max-width: 795px) {
    h1 { font-size: 2.5rem; width: 320px; }
    p  { font-size: 0.8rem;  width: 320px; }
  }
  @media (max-width: 568px) {
    h1 { width: 300px; }
    p  { width: 300px; }
  }
`;

const IntroText = styled.div`
  position: absolute;
  top: 7rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  z-index: 2;

  h2 {
    font-size: 3rem;
    font-weight: 850;
    color: #fcb834;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    top: 6rem;
    width: 90%;
  }
`;

const PopularArticles = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1000px;
  background: rgba(0, 0, 0, 0.7);
  padding: 1.5rem;
  border-radius: 1rem;
  color: #fff;
  z-index: 2;
  font-family: 'Pretendard', sans-serif;

  h2 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    font-weight: bold;
    color: #ffd700;
    text-align: center;
  }

  .article-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.1rem 1rem;
  }

  .article-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.4rem;

    .rank {
      color: #00ffff;
      font-weight: bold;
      width: 1.5rem;
    }

    .title {
      flex: 1;
      margin-left: 0.6rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .count {
      font-size: 0.85rem;
      color: #ccc;
      margin-left: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchBar = styled.div`
  position: absolute;
  bottom: 19rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  max-width: 1000px;
  display: flex;
  gap: 1rem;
  align-items: center;
  z-index: 3;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .search-input-group {
    position: relative;
    flex: 1;

    input[type="text"] {
      width: 100%;
      padding: 0.75rem 3rem 0.75rem 1rem;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    button {
      position: absolute;
      top: 50%;
      right: 0.75rem;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      font-size: 1.2rem;
      color: #4a6cf7;
      cursor: pointer;
    }
  }

  input[type="date"] {
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .search-input-group, input[type="date"] {
      width: 100%;
    }
  }
`;


export default Home;
