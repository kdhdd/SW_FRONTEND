import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

function Home() {
  useEffect(() => {
    ScrollReveal().reveal(".text", { delay: 200, origin: "top" });
    ScrollReveal().reveal(".form-container form", { delay: 400, origin: "left" });
  }, []);

  return (
    <section className="home" id="home">
      <div className="text">
        <h1><span>Looking</span> to <br />rent a car</h1>
        <p>Where Will the Road Take You? Rent a Car and Find Out!</p>
        <div className="app-stores">
          <img src="https://i.postimg.cc/tRY8QX2M/ios.png" alt="ios" />
          <img src="https://i.postimg.cc/2yRQKFHm/android.png" alt="android" />
        </div>
      </div>

      <div className="form-container">
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
      </div>
    </section>
  );
}

export default Home;
