
import React, { useState, useEffect, useRef } from "react"; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';// to create chart library 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './styles.css';

function StockDashBoard(){
  //Symbol states
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStokcName, setselectedStockName] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  //DrawGraph States
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiError, setIsApiError] = useState(false); 
  const [showChart, setShowChart] = useState(false);

  const toastId = useRef(null);

  const handleSymbolSelect = (symbol,name) => {
    setSelectedSymbol(symbol);
    setselectedStockName(name)
    setSuggestions([]);
  };
  
  useEffect(()=>{
    console.log(symbol);
  })

//suggestion fetch
  useEffect(() => {

    const fetchSuggestions = async () => {
    const API_KEY = process.env.REACT_APP_API_KEY 
    const searchUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    const searchJsonData = await searchResponse.json();
    console.log(searchJsonData);
    if (searchJsonData.Note||searchJsonData.Information){
      setSelectedSymbol(null)
      setSuggestions([])
      console.log('API suggestion limit exceeded, please try later!');
      if(! toast.isActive(toastId.current))
      toastId.current = toast.error('API suggestion limit exceeded, please try later!',{
        position: toast.POSITION.TOP_CENTER
      }
      );
    }
    const newSuggestions = searchJsonData.bestMatches.map((match) => {
      const symbol = match['1. symbol'];
      const name = match['2. name'];
      return { symbol, name};
    });
    console.log(newSuggestions);
    setSuggestions(newSuggestions);
  };  
  if (symbol.length >= 2) {
    console.log('it runs');
    fetchSuggestions();
  } else {
    setSuggestions([]);
  }
}, [symbol]);

console.log(symbol);

// Graph Fetch
useEffect(() => {
  async function fetchData() {
    const API_KEY = process.env.REACT_APP_API_KEY
    try{
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedSymbol}&interval=60min&&apikey=${API_KEY}`;
      const response = await fetch(url);
      const jsonData = await response.json();
      console.log(jsonData);
    
      if (jsonData.Note) {  // if API stock info limit exceeds
        console.log('api value error');
        setIsApiError(true); // Set the flag to indicate API call failure
        setIsLoading(false);
        setShowChart(false)

        return;
      }
      if(jsonData['Error Message']){
        console.log('Invalid api call error');
        toastId.current = toast.error('API suggestion limit exceeded, please try later!',{
          position: toast.POSITION.TOP_CENTER
        })
        setIsApiError(true);
        setShowChart(false)
      }
      
      const newDataList = [];
      for (const [timestamp, financialData] of Object.entries(jsonData["Time Series (60min)"])) {
        newDataList.push({
          timestamp: timestamp,
          open: parseFloat(financialData['1. open']),
          high: parseFloat(financialData['2. high']),
          low: parseFloat(financialData['3. low']),
          close: parseFloat(financialData['4. close']),
          volume: parseInt(financialData['5. volume'])
        });
      }
      
      const filteredData = newDataList.filter(el => {
        return Date.parse(el.timestamp) > get24AgoGMT()
      });
      const sortedDataList = filteredData.sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp);
      });
      console.log(sortedDataList);
      setDataList(sortedDataList);
      setIsLoading(false);
      setShowChart(true)
    }
    catch(error){
     // setIsApiError(true); // Set the flag to indicate API call failure
      setIsLoading(false);
      console.log(error);
     // console.error('Error:', error);
      setShowChart(false)
    }
  }
  if (selectedSymbol){
    fetchData();
  }

}, [selectedSymbol]);


  return (
    <div>
      <SearchBar 
      symbol={symbol}
      onFilterStockChange ={setSymbol}/>
      <Suggestions
            suggestions={suggestions}
            handleSymbolSelect ={handleSymbolSelect }
             />
    {showChart &&       
      <DrawGraph 
      selectedSymbol={selectedSymbol}
      dataList={dataList}
      isLoading ={isLoading} 
       />}
        <ToastContainer autoClose={8000}/>
    </div>
  );
}


function SearchBar({symbol,  onFilterStockChange}){

  return(
    <form action="">
      <label >
        Search A Stock
        <input 
        type="text"
        value={symbol} placeholder="Search..." 
        onChange={(e)=> onFilterStockChange(e.target.value)}/>
      </label>
    </form>
  )
}

function Suggestions({suggestions,handleSymbolSelect}){



  return (
    <ul>
      {suggestions.map((suggestion, index) => {
        return (<li key={index} onClick={() => handleSymbolSelect(suggestion.symbol,suggestion.name)} 
        >{suggestion.symbol} {suggestion.name} </li>);          
      })}
    </ul>
  );

}

function DrawGraph({selectedSymbol, selectedStokcName, dataList, isLoading}) {
  console.log(selectedSymbol,selectedStokcName);


    // if(isApiError){
    //   return (
    //       <Notification
    //       message="Api limit exceeded; Failed to fetch data for the stock symbol."
    //       onClose={() => setIsApiError(false)}
    //     />
    //   );
    // }

    // if(!showChart){
    //   return null;
    // }

    return (     
      <div className="graph">
        {<h1> {selectedSymbol} {selectedStokcName} {dataList && dataList?.at(-1)?.close} USD </h1>}
        {<BuySellButton></BuySellButton>}
        {isLoading ? (
          <p>Loading...</p>
        ) : (<LineChart width={1200} height={300} data={dataList}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="timestamp"/>
          <YAxis 
           ticks={[0, (parseInt(dataList[0]?.close))/2,(parseInt(dataList?.at(-1).close))*2]} // it defines graph y axis numbers
           interval={'preserveEnd'}
          />
          <Tooltip />
          <Legend name="close value (USD)" />
          <Line type="monotone" dataKey="close" stroke="#8884d8" name="Close Value(USD)" />
        </LineChart>)         
        }
      </div>
    );      
  }

  
function BuySellButton({sellStock,buyStock}){
    function sellClick() {
        alert('SOLD')
    }
    function buyClick() {
        alert('PURCHASED')
    }


    return(
        <div>
            <Button onClick={sellClick}>
                Sell
            </Button>
            <Button onClick={buyClick}>
                Buy
            </Button>
        </div>
    )
}


function Button({ onClick,children}) {
    return (
      <button onClick={onClick}>
        {children}
      </button>
    );
  }

  function get24AgoGMT (){
    const currentUtcDate = new Date();
    const currentUtcDateString = currentUtcDate.toISOString();
    
    // Subtract 24 hours from the current UTC datetime
    const twentyFourHoursAgo = new Date(currentUtcDate.getTime() - (72 * 60 * 60 * 1000));
    const twentyFourHoursAgoString = twentyFourHoursAgo.toISOString();
 
    return Date.parse(twentyFourHoursAgo)
    }
    


export default StockDashBoard;
