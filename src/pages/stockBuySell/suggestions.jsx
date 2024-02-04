import React from "react";

export const Suggestions =   function ({suggestions,handleSymbolSelect}){
    return (
      <ul>
        {suggestions.map((suggestion, index) => {
          return (<li key={index} onClick={() => handleSymbolSelect(suggestion.symbol,suggestion.name)} 
          >{suggestion.symbol} {suggestion.name} </li>);          
        })}
      </ul>
    );
  }
  