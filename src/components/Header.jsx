import styled from "styled-components";
import handcuffIcon from "../assets/handcuffs-solid.svg";

function Header() {
  return (
    <HeaderWrapper>
      <Logo>
        <img src={handcuffIcon} alt="handcuffs logo" />
      </Logo>

      <MenuIcon />

      <NavBar>
        <li><a href="#home">Home</a></li>
        <li><a href="#ride">Episodes</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#reviews">Reviews</a></li>
      </NavBar>

      <HeaderBtn>
        <a href="#" className="sign-up">Sign Up</a>
        <a href="#" className="sign-in">Sign In</a>
      </HeaderBtn>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  position: fixed;
  width: 100%;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #eeeff1;
  padding: 15px 100px;

  @media (max-width: 991px) {
    padding: 18px 40px;
  }
  @media (max-width: 795px) {
    padding: 11px 40px;
  }
  @media (max-width: 460px) {
    padding: 6px 14px;
  }
`;

const Logo = styled.a.attrs({ className: "logo", href: "#" })`
  img {
    width: 40px;

    @media (max-width: 460px) {
      width: 30px;
    }
  }
`;

const MenuIcon = styled.i.attrs({
  className: "bx bx-menu",
  id: "menu-icon",
})`
  font-size: 24px;
  cursor: pointer;
  z-index: 110;
  display: none;

  @media (max-width: 795px) {
    display: initial;
  }
`;

const NavBar = styled.ul.attrs({ className: "navbar" })`
  display: flex;

  li {
    position: relative;
  }

  a {
    font-size: 1rem;
    padding: 10px 20px;
    color: var(--text-color);
    font-weight: 500;

    &::after {
      content: "";
      width: 0;
      height: 3px;
      background: var(--gradient);
      position: absolute;
      bottom: -4px;
      left: 0;
      transition: 0.5s;
    }

    &:hover::after {
      width: 100%;
    }
  }

  @media (max-width: 795px) {
    position: absolute;
    top: -500px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    transition: 0.2s ease;
    text-align: left;

    &.active {
      top: 100%;
    }

    a {
      padding: 1rem;
      margin: 1rem;
      display: block;
      border-left: 2px solid var(--main-color);
      transition: 0.3s ease;

      &:hover {
        color: #ffffff;
        background: var(--main-color);
        border: none;
      }

      &::after {
        display: none;
      }
    }
  }
`;

const HeaderBtn = styled.div.attrs({ className: "header-btn" })`
  a {
    padding: 10px 20px;
    color: var(--text-color);
    font-weight: 500;
  }

  .sign-in {
    background: #474fa0;
    color: #ffffff;
    border-radius: 0.5rem;
    transition: 0.5s;

    &:hover {
      background: var(--main-color);
    }
  }

  @media (max-width: 795px) {
    .sign-up {
      display: none;
    }
  }

  @media (max-width: 460px) {
    .sign-in {
      padding: 7px 10px;
      font-size: 14px;
      font-weight: 400;
    }
  }
`;

export default Header;
