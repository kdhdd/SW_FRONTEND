function Reviews() {
    const reviews = [
      {
        img: "rev1.jpg",
        name: "Alan Doe",
        stars: 4.5,
        text: "It was clean, well-maintained... Highly recommend!"
      },
      {
        img: "rev2.jpg",
        name: "John Ford",
        stars: 5,
        text: "Best value for my money. Worth every penny!"
      },
      {
        img: "rev3.jpg",
        name: "Katharina Moss",
        stars: 5,
        text: "No hidden fees, no hassle - just a great experience!"
      }
    ];
  
    return (
      <section className="reviews" id="reviews">
        <div className="heading">
          <span>Reviews</span>
          <h1>What our Customers Say</h1>
        </div>
        <div className="reviews-container">
          {reviews.map((r, idx) => (
            <div className="box" key={idx}>
              <div className="rev-img">
                <img src={`https://i.postimg.cc/${r.img}`} alt={r.name} />
              </div>
              <h2>{r.name}</h2>
              <div className="stars">
                {[...Array(Math.floor(r.stars))].map((_, i) => <i key={i} className="ri-star-fill"></i>)}
                {r.stars % 1 !== 0 && <i className="ri-star-half-fill"></i>}
              </div>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default Reviews;
  