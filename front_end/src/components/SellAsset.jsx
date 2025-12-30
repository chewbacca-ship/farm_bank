import { useState } from "react";
import { dataBase } from "../api/Api";
import arrow_down from '../assets/arrow-down.svg'
import chart_line_down from '../assets/chart_line_down.svg'
import chart_line_up from '../assets/chart_line_up.svg'
import caret_left from '../assets/arrow-left.svg'
import info from '../assets/info.svg'

const SellAsset = ({profile, setProfile, setAsset, selectedAsset, handleShowSellModal}) => {

    const [amountToSell, setAmountToSell] = useState("")
    const [message, setMessage] = useState("")
    const [showSellNow, setShowSellNow] = useState(false);
    const [sellNow, setSellNow] = useState(false);

    const balance = profile?.account?.wallet_balance;

    const handleSell = async (e) => {
            e.preventDefault()
    
            if (!amountToSell || isNaN(amountToSell) || Number(amountToSell) <= 0){
                setMessage("Please enter a valid amount.");
                return;
            }
    
            const pricePerUnit = selectedAsset.price
            const quantity = Number(amountToSell)/pricePerUnit
    
            try {
                const response = await dataBase.sellAsset({
                    name: selectedAsset.name,
                    icon: selectedAsset.icon,
                    symbol: selectedAsset.symbol,
                    type: selectedAsset.type,
                    price: selectedAsset.price,
                    quantity: quantity.toFixed(6), // keep it clean for backend Decimal type
                    current_value: amountToSell
                })
    
                if (response && response.asset) {
                    setAsset(prev => [...prev, response.asset]);
                    setMessage("Asset sold successfully!");
                    setAmountToSell(""); // reset input
                } else {
                    setMessage(response.error || "Sale failed.");
                }
                
            } catch (error) {
            setMessage("An error occurred while buying the asset.");
            console.error(error);}
        };

    const handleSellNow = () => {
        setSellNow(!sellNow)
    }
    

    return (
        <section className="absolute inset-0 z-30 bg-white">
                <button onClick={handleShowSellModal} className="block my-2">
                    <img src={caret_left} alt="" />
                </button>
                <div className="my-2">
                <h3 className="font-bold text-2xl my-4">How to sell</h3>
                <div className="" onClick={handleSellNow}>
                    <div className="bg-red-900 flex flex-row  p-2">
                        <div className="bg-red-500 flex flex-col justify-center items-center p-2 rounded-lg mr-4">
                            <img src={arrow_down} alt="arrow down"/>

                        </div>
                        
                        <div>
                            <h4 className="font-bold">Sell Now</h4>
                            <p>Sell this stock at the current price</p>
                        </div>
                    </div>
                   
                </div>

                <div className="bg-red-900 flex flex-row  p-2 my-3">
                    <div className="bg-red-500 flex flex-col justify-center items-center p-2 rounded-lg mr-4">
                        <img src={chart_line_down} alt="" />

                    </div>
                    
                    <div>
                        <h4>Limit Order</h4>
                        <p>sell this crop at a price below the current market price</p>
                    </div>
                </div>

                <div className="bg-red-900 flex flex-row  p-2 my-3">
                    <div className="bg-red-500 flex flex-col justify-center items-center p-2 rounded-lg mr-4">
                        <img src={chart_line_up} alt="" />
                    </div>
                    <div>
                        <h4>Stop Order</h4>
                        <p>Sell this crop at a price below the current market price</p>
                    </div>
                </div>
            </div>
            {sellNow &&  <form onSubmit={handleSell} className="absolute inset-0 z-40 bg-white">
                                <button onClick={handleSellNow}>
                                    <img src={caret_left} alt="" />
                                </button>
                                <div className="flex flex-col items-center">
                                    <input 
                                        placeholder="$0.00" 
                                        value={amountToSell} 
                                        onChange={(e) => setAmountToSell(e.target.value)}
                                        className="w-auto block  border border-red-600 p-2 rounded-lg"
                                    />
            
                                    <div className="flex flex-row justify-between items-center w-full my-4 border-b border-gray-400 py-2">
                                        <p>Price per unit</p>
                                        <p>${selectedAsset.price}</p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center w-full my-4 border-b border-gray-400 py-2">
                                        <div className="flex flex-row items-center">
                                            <p>Balance</p>
                                            <img src={info} alt=""  className="w-4 h-4 ml-1"/>
            
                                        </div>
                                        
                                        <p>${balance}</p>
                                    </div>
                                    <button type="submit" className="text-white bg-red-900 px-10 py-2 rounded-lg my-4">Sell</button>
                                </div>
                            </form>
                        }
                        
        </section>
    )

}

export default SellAsset;