import StockDashBoard from './pages/dashboard/StockDashBoard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from './components/navbar';
import { Investments } from './components/investments';


function App() {
  return (
    <div>
        <Router>
        <Navbar/>
        <Routes>
            <Route path="/" element ={<StockDashBoard/>} />
            <Route path="/investments" element ={<Investments/>} />
            <Route path="/portfolio"/>
        </Routes>
        </Router>
    </div>
  );
}

export default App;