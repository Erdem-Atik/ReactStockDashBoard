import React, { useState, useEffect, useRef } from "react"; 
import { ToastContainer, toast } from 'react-toastify';
import { DrawGraph } from "./drawGraph";
import { Suggestions } from "./suggestions";
import { SearchBar } from "./searchBar";
import { get24AgoGMT } from "./get24AgoGMT";
import { BuySellStock } from "./buySell";
import 'react-toastify/dist/ReactToastify.css';


export function DashBoard(){
  //Symbol states
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStockName, setselectedStockName] = useState(null);
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
    console.log(symbol,selectedStockName);
  })

//suggestion fetch
  useEffect(() => {

    const fetchSuggestions = async () => {
    const API_KEY = process.env.REACT_APP_API_KEY 
    const searchUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${API_KEY}`; //${symbol}
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
    if(searchJsonData){
      
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

    fetchSuggestions();
  } else {
    setSuggestions([]);
  }
}, [symbol]);

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
        toastId.current = toast.error( `API's stock value limit exceeded, please try later!`,{
          position: toast.POSITION.TOP_CENTER
        })

        return;
      }
      if(jsonData['Error Message']){
        console.log('Invalid api call error');
        toastId.current = toast.error('Invalid api call error, please try later!',{
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

      console.log(newDataList);

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
    {showChart &&(    
      <BuySellStock/>&&  
     <DrawGraph      
      selectedSymbol={selectedSymbol}
      selectedStockName={selectedStockName}
      dataList={dataList}
      isLoading ={isLoading} 
       />)}
        <ToastContainer autoClose={8000}/>
    </div>
  );
}


