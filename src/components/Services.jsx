function Services() {
    return (
      <section className="services" id="services">
        <div className="heading">
          <span>Best Services</span>
          <h1>Explore out Top Deals <br /> From Top Rated Dealers</h1>
        </div>
        <div className="services-container">
          {[
            { img: "car1.jpg", title: "Honda Civic Type R", year: "2025", price: "$45,895", monthly: "$276" },
            { img: "car2.jpg", title: "Honda Civic", year: "2025", price: "$28,450", monthly: "$171" },
            { img: "car3.jpg", title: "Honda Civic Si", year: "2025", price: "$29,000", monthly: "$174" },
            { img: "car4.jpg", title: "Honda Civic Type R", year: "2023", price: "$43,000", monthly: "$258" },
            { img: "car5.jpg", title: "Honda Civic Type R", year: "2023", price: "$43,000", monthly: "$258" },
            { img: "car6.jpg", title: "Porsche Cayman GT4", year: "2025", price: "$100,000", monthly: "$600" }
          ].map((car, idx) => (
            <div className="box" key={idx}>
              <div className="box-img">
                <img src={`https://i.postimg.cc/${car.img}`} alt={car.title} />
              </div>
              <p>{car.year}</p>
              <h3>{car.title}</h3>
              <h2>{car.price} | {car.monthly} <span>/month</span></h2>
              <a href="#" className="btn">Rent Now</a>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default Services;
  