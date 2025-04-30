function About() {
    return (
      <section className="about" id="about">
        <div className="heading">
          <span>About Us</span>
          <h1>Best Customer Experience</h1>
        </div>
        <div className="about-container">
          <div className="about-img">
            <img src="https://i.postimg.cc/KjtmmbFC/about.png" alt="about" />
          </div>
          <div className="about-text">
            <span>About us</span>
            <p>We're passionate about providing you with the perfect vehicle for your needs...</p>
            <p>Our commitment to excellence begins with our extensive inventory...</p>
            <a href="#" className="btn">Learn More</a>
          </div>
        </div>
      </section>
    );
  }
  
  export default About;
  