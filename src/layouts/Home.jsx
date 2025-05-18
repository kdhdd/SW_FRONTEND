import { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import styled from "styled-components";

function Home() {
  useEffect(() => {
    ScrollReveal().reveal(".text",           { delay: 200, origin: "top"  });
    ScrollReveal().reveal(".form-container", { delay: 400, origin: "left" });
  }, []);

  return (
    <>
      <HomeSection id="home">
        <Text>
          <h1><span>눈앞에서 펼쳐지는 현장</span></h1>
          <p>지금 이 순간, 현장에 접속하다</p>
        </Text>

        <FormContainer>
          <form>
            <div className="input-box">
              <span>Location</span>
              <input type="search" placeholder="Search Places" />
            </div>
            <div className="input-box">
              <span>Pick-up Date</span>
              <input type="date" />
            </div>
            <div className="input-box">
              <span>Return Date</span>
              <input type="date" />
            </div>
            <input type="submit" className="btn" value="Search" />
          </form>
        </FormContainer>
      </HomeSection>
    </>
  );
}

const HomeSection = styled.section`
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: url("/src/assets/main.png") center right / cover no-repeat;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 881px) {
    background-position: center;
  }
  @media (max-width: 795px) {
    grid-template-columns: 1fr;
  }
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
