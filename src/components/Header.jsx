function Header() {
  return (
    <header>
      <a href="#" className="logo">
        <img src="https://i.postimg.cc/gcZdykyW/jeep.png" alt="car logo" />
      </a>

      <i className="bx bx-menu" id="menu-icon"></i>

      <ul className="navbar">
        <li><a href="#home">Home</a></li>
        <li><a href="#ride">Ride</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#reviews">Reviews</a></li>
      </ul>

      <div className="header-btn">
        <a href="#" className="sign-up">Sign Up</a>
        <a href="#" className="sign-in">Sign In</a>
      </div>
    </header>
  );
}

export default Header;
