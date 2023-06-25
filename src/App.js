"use strict";
import React, { useState, useEffect } from "react"; 
import Notification from './Notifications.js'
import './styles.css';
import DrawGraph  from "./DrawGraph.js";

function StockSymbolInput() {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedStockName, setselectedStockName] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
      const fetchSuggestions = async () => {
      const searchUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=EVAIYPOEEXP1A87A`;
      const searchResponse = await fetch(searchUrl);
      const searchJsonData = await searchResponse.json();
      if (searchJsonData.Note){
        setShowNotification(true)
        setSelectedSymbol(null)
        setSuggestions([])
        console.log('API suggestion limit exceeded, please try later!');
      }
      const newSuggestions = searchJsonData.bestMatches.map((match) => {
        const symbol = match['1. symbol'];
        const name = match['2. name'];
        return { symbol, name};
      });
      setSuggestions(newSuggestions);
    };  
    if (symbol.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [symbol]);

  const handleInputChange = (event) => {
    setSymbol(event.target.value);
  };

  const handleSymbolSelect = (symbol,name) => {
    setSelectedSymbol(symbol);
    setselectedStockName(name)
    setSuggestions([]);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <div>
      <form >
        <input
          type="text"
          placeholder="Enter a stock symbol"
          value={symbol}
          onChange={handleInputChange}
        />
      </form>
    <ul>
      {suggestions.map((suggestion, index) => {
        return (<li key={index} onClick={() => handleSymbolSelect(suggestion.symbol,suggestion.name)} >{suggestion.symbol} {suggestion.name} </li>);          
      })}
    </ul>
    {selectedSymbol && <DrawGraph 
    stockSymbol={selectedSymbol}
    stockName = {selectedStockName} 
    />}
    {showNotification&&(
      <Notification
      message="API Suggestion Limit Exceeded. Please try again a minutes later."
      onClose={closeNotification}
      />
    )}
    </div>
  );
}



export default StockSymbolInput;
