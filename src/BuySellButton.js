import { Children } from "react";

function BuySellButton({sellStock,buyStock}){
    return(
        <div>
            <Button onClick={sellStock}>
                Sell
            </Button>
            <Button onClick={buyStock}>
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

  export default BuySellButton