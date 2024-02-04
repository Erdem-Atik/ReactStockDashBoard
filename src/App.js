import {DashBoard} from './pages/stockBuySell/dashBoard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from './components/navbar';
import { Investments } from './pages/myInvesments/investments';


function App() {
  return (
    <div>
        <Router>
        <Navbar/>
        <Routes>
            <Route path="/" element ={<DashBoard/>} />
            <Route path="/investments" element ={<Investments/>} />
            <Route path="/portfolio"/>
        </Routes>
        </Router>
    </div>
  );
}

export default App;