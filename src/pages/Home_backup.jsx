import { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import styled from "styled-components";
import homeVideo from "/src/assets/home.mp4";

function Home() {
  useEffect(() => {
    ScrollReveal().reveal(".text",           { delay: 200, origin: "top"  });
    ScrollReveal().reveal(".form-container", { delay: 400, origin: "left" });
  }, []);

  return (
    <>
      <HomeSection id="home">
          {/* 배경 비디오 */}
        <BgVideo autoPlay muted loop playsInline>
          <source src={homeVideo} type="video/mp4" />
          {/* 브라우저가 mp4를 못 읽을 때 대비해 대체 이미지 */}
          <img src="/src/assets/main.png" alt="" />
        </BgVideo>
        <Text>
          <h1><span>눈앞에서 펼쳐지는 현장</span></h1>
          <p>지금 이 순간, 현장에 접속하다</p>
        </Text>

        
      </HomeSection>
    </>
  );
}

// styled-components
const HomeSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);

  /* 이미지 background 속성은 제거! */
  @media (max-width: 881px) {
    /* 비디오는 object-fit: cover라서 위치 조정 필요 없음 */
  }
  @media (max-width: 795px) {
    grid-template-columns: 1fr;
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

const FormContainer = styled.div.attrs({ className: "form-container" })`
  /* 바깥 div는 위치만 조절 */
  @media (max-width: 795px) {
    padding-top: 2rem;
  }

  form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    position: absolute;
    bottom: 4rem;
    left: 100px;
    background: #ffffff;
    padding: 20px;
    border-radius: 0.5rem;

    @media (max-width: 795px) {
      position: unset;
    }

    .input-box {
      flex: 1 1 7rem;
      display: flex;
      flex-direction: column;

      span { font-weight: 500; }
      input {
        padding: 7px;
        outline: none;
        border: none;
        background: #eeeff1;
        border-radius: 0.5rem;
        font-size: 1rem;
      }
    }

    .btn {
      flex: 1 1 7rem;
      padding: 10px 34px;
      border: none;
      border-radius: 0.5rem;
      background: #474fa0;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: 0.5s;

      &:hover { background: var(--main-color); }
    }
  }
`;

export default Home;
