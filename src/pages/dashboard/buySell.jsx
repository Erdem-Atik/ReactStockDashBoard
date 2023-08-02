import React from "react";

export const BuySellButton = function BuySellButton({sellStock,buyStock}){
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

