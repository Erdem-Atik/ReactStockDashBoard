
function BuySellButton({sellStock,buyStock}){
    function sellClick() {
        alert('SOLD')
    }
    function buyClick() {
        alert('PURCHASED')
    }


    return(
        <div>
            <Button onClick={sellClick}>
                Sell
            </Button>
            <Button onClick={buyClick}>
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