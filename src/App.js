import Intro from './components/intro';
import NavBar from './components/navBar';
import InfinteScroll from './components/infinteScroll';
import InfinteScrollReverse from './components/infinteScrollReverse';
import './App.css';
function App() {
  return (
    <div className="App">
      <NavBar />
      <Intro />
      <InfinteScroll />
      <InfinteScrollReverse />
    </div>
  );
}

export default App;
