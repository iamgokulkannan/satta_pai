import Intro from './components/intro';
import NavBar from './components/navBar';
import Featured from './components/featured';
import InfinteScroll from './components/infinteScroll';
import InfinteScrollReverse from './components/infinteScrollReverse';
import Curated from './components/curated';
import Branding from './components/branding';
import Footer from './components/footer';
import './App.css';
function App() {
  return (
    <div className="App">
      <NavBar />
      <Intro />
      <Curated />
      <Featured />
      <InfinteScroll />
      <InfinteScrollReverse />
      <Branding/>
      <Footer/>
    </div>
  );
}

export default App;
