import React, {useContext} from "react";
import { InvestContext } from "../../context/invest-context";


export const BuySellStock = function BuySellButton({sellStock,buyStock}){
    function sellClick() {
        alert('SOLD')       
    }
    function buyClick() {
        alert('PURCHASED')
    }

    return(
        <div>
            <button onClick={sellClick}>
                Sell
            </button>
            <button onClick={buyClick}>
                Buy
            </button>
        </div>
    )
}

