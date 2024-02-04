import React from "react"

export const  SearchBar = function({symbol,  onFilterStockChange}){
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
  