import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Ride from './components/Ride';
import Services from './components/Services';
import About from './components/About';
import Reviews from './components/Reviews';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import 'remixicon/fonts/remixicon.css';
import 'boxicons/css/boxicons.min.css';

function App() {
  return (
    <>
      <Header />
      <Home />
      <Ride />
      <Services />
      <About />
      <Reviews />
      <Newsletter />
      <Footer />
    </>
  );
}

export default App;
