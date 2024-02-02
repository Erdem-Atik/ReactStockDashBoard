import { createContext, useEffect, useState } from "react";

export const InvestContext = createContext(null);

const mydefaultInvestments= {};

export const InvestContextProvider = ({ children }) => {
  const [myInvestments, setMyInvestments] = useState(mydefaultInvestments);

  const getTotalInvestments =()=>{
    let total = 0;
    for (let key in myInvestments) {
      total += myInvestments[key].amount;
    }
    return total;
  }

  const buyStock = (selectedStock)=>{
    setMyInvestments({...myInvestments, [selectedStock.symbol]: selectedStock});
  }

  const sellStock = (symbol)=>{
   const newInvestments = {...myInvestments};
   delete newInvestments[symbol];
   setMyInvestments(newInvestments);
 }

}