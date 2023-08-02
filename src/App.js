import StockDashBoard from './pages/dashboard/StockDashBoard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from './components/navbar';


function App() {
  return (
    <div>
        <Router>
        <Navbar/>
        <Routes>

            <Route path="/" element ={<StockDashBoard/>} />
            <Route path="/portfolio"/>
        </Routes>
        </Router>
    </div>
  );
}

export default App;