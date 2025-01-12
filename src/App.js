import Intro from './components/intro';
import NavBar from './components/navBar';
import InfinteScroll from './components/infinteScroll';
import InfinteScrollReverse from './components/infinteScrollReverse';
import Curated from './components/curated';
import './App.css';
function App() {
  return (
    <div className="App">
      <NavBar />
      <Intro />
      <Curated />
      <InfinteScroll />
      <InfinteScrollReverse />
    </div>
  );
}

export default App;
