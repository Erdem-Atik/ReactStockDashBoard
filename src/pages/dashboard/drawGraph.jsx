import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';// to create chart library 
import { BuySellButton } from "./buySell";


export const DrawGraph = function ({selectedSymbol, selectedStockName, dataList, isLoading}) {
    console.log(selectedSymbol,selectedStockName, dataList);
  
    
      return (     
        <div className="graph">
          {<h1> {selectedSymbol} {selectedStockName} {dataList && dataList?.at(-1)?.close} USD </h1>}
          {<BuySellButton></BuySellButton>}
          {isLoading ? (
            <p>Loading...</p>
          ) : (<LineChart width={1200} height={300} data={dataList}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="timestamp"/>
            <YAxis 
             ticks={[0, (parseInt(dataList && dataList[0]?.close))/2,(parseInt(dataList && dataList?.at(-1).close))*2]} // it defines graph y axis numbers
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