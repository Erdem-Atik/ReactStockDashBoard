import React, { useEffect,useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';// to create chart library
import Notification from './Notifications.js'
import get24AgoGMT from "./timeStamps.js";   // to find correct timestamp

function DrawGraph({stockSymbol,stockName}) {
  console.log(stockSymbol,stockName);


    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isApiError, setIsApiError] = useState(false); 
    const [showChart, setShowChart] = useState(true);

    useEffect(() => {
      async function fetchData() {
        const API_KEY = process.env.REACT_APP_API_KEY

        try{
          const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=60min&&apikey=${API_KEY}`;
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
            setIsApiError(true);
            setShowChart(false)
          }
          
          console.log(`setchart status: ${showChart}`);

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
          console.error('Error:', error);
          setShowChart(false)
        }
      }
      fetchData();
    }, [stockSymbol]);
  
    if(isApiError){
      return (
          <Notification
          message="Api limit exceeded; Failed to fetch data for the stock symbol."
          onClose={() => setIsApiError(false)}
        />
      );
    }

    if(!showChart){
      return null;
    }

    return (     
      <div className="graph">
        {<h1> {stockSymbol} {stockName} {dataList && dataList?.at(-1)?.close} USD </h1>}
        {isLoading ? (
          <p>Loading...</p>
        ) : (<LineChart width={1200} height={300} data={dataList}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="timestamp"/>
          <YAxis 
           ticks={[0, (parseInt(dataList && dataList[0]?.close))/2,(parseInt(dataList &&  dataList?.at(-1).close))*2]} // it defines graph y axis numbers
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

  export default DrawGraph