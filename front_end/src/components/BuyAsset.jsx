import { useState } from "react";
import { dataBase } from "../api/Api";
import recurrent_icon from '../assets/recurrent.svg'
import arrow_down from '../assets/arrow-down.svg'
import chart_line_down from '../assets/chart_line_down.svg'
import chart_line_up from '../assets/chart_line_up.svg'
import caret_left from '../assets/arrow-left.svg'
import info from '../assets/info.svg'

const BuyAsset = ({profile, setProfile, setAsset, selectedAsset, handleShowBuyModal}) => {

    const [amountToPurchase, setAmountToPurchase] = useState("")
    const [message, setMessage] = useState("")
    const [showBuyNow, setShowBuyNow] = useState(false);

    const balance = profile?.account?.wallet_balance

    const handleBuy = async (e) => {
        e.preventDefault()

        if (!amountToPurchase || isNaN(amountToPurchase) || Number(amountToPurchase) <= 0){
            setMessage("Please enter a valid amount.");
            return;
        }

        const pricePerUnit = selectedAsset.price
        const quantity = Number(amountToPurchase)/pricePerUnit

        try {
            const response = await dataBase.addAsset({
                name: selectedAsset.name,
                icon: selectedAsset.icon,
                symbol: selectedAsset.symbol,
                type: selectedAsset.type,
                price: selectedAsset.price,
                quantity: quantity.toFixed(6), // keep it clean for backend Decimal type
                current_value: selectedAsset.price
            })
            setShowBuyNow(false)
            console.log("response:",response)

            if (response && response.asset) {
                setAsset(prev => [...prev, response.asset]);
                setMessage("Asset purchased successfully!");
                setAmountToPurchase(""); // reset input
            } else {
                setMessage(response.error || "Purchase failed.");
            }
            
        } catch (error) {
        setMessage("An error occurred while buying the asset.");
        console.error(error);}
    };

    const handleBuyNow = () => {
        setShowBuyNow(!showBuyNow)

    }
    
        
    
    return (
        <section className="absolute inset-0 z-30 bg-white">
            <button onClick={handleShowBuyModal}>
                <img src={caret_left} alt="" />
            </button>
            <div>
                <h2 className="font-bold text-2xl my-4">How to buy</h2>
                <p>Choose the way you want to purchase this stock</p>
            </div>
            <div >
                <h3 className="font-bold text-lg">Automatic Investment</h3>

                <div className="bg-green-900 text-white flex flex-row items-center p-2 my-3">
                    <div className="bg-green-500 h-16 w-16 rounded-lg flex flex-col items-center justify-center mr-4">
                        <img src={recurrent_icon} alt="recurrent icon" className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col ">
                        <h4 className="font-bold">Buy every Month</h4>
                        <p>Automatically invest in this crop on a monthly basis</p>
                    </div>
                </div>
            </div>
            <div >
                <h3 className="font-bold text-lg">One-time Purchase</h3>
                <div>
                    <div className="bg-green-900 text-white flex flex-row items-center p-2 my-3 cursor-pointer" onClick={handleBuyNow}>
                        <div className="bg-green-500 h-16 w-16 rounded-lg flex flex-col items-center justify-center mr-4">
                            <img src={arrow_down} alt="arrow down icon" className="w-6 h-6"  />
                        </div>
                        <div>
                            <h4 className="font-bold">Buy Now</h4>
                            <p>Buy this stock at the current price</p>
                        </div>
                        
                    </div>
        
                </div>

                <div className="bg-green-900 text-white flex flex-row items-center p-2 my-3">
                    <div className="bg-green-500 h-16 w-16 rounded-lg flex flex-col items-center justify-center mr-4">
                        <img src={chart_line_down} alt="chart line down" className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold">Limit Order</h4>
                        <p>Buy this crop at a price below the current market price</p>
                    </div>
                </div>

                <div className="bg-green-900 text-white flex flex-row items-center p-2 my-3"> 
                    <div className="bg-green-500 h-16 w-16 rounded-lg flex flex-col items-center justify-center mr-4">
                        <img src={chart_line_up} alt="chart line up" />
                    </div>
                    <div>
                        <h4 className="font-bold">Stop Order</h4>
                        <p>Buy this crop at a price below the current market price</p>
                    </div>
                </div>
            </div>

             {  showBuyNow && 
                <form onSubmit={handleBuy} className="absolute inset-0 z-40 bg-white">
                    <button onClick={handleBuyNow}>
                        <img src={caret_left} alt="" />
                    </button>
                    <div className="flex flex-col items-center">
                        <input 
                            placeholder="$0.00" 
                            value={amountToPurchase} 
                            onChange={(e) => setAmountToPurchase(e.target.value)}
                            className="w-auto block  border border-green-600 p-2 rounded-lg"
                        />

                        <div className="flex flex-row justify-between items-center w-full my-4 border-b border-gray-400 py-2">
                            <p>Price per unit</p>
                            <p>${selectedAsset.price}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center w-full my-4 border-b border-gray-400 py-2">
                            <div className="flex flex-row items-center">
                                <p>Investable cash</p>
                                <img src={info} alt=""  className="w-4 h-4 ml-1"/>

                            </div>
                            
                            <p>${balance}</p>
                        </div>
                        <button type="submit" className="bg-green-900 p-2 rounded-lg my-4">Purchase</button>
                    </div>
                </form>
            }

            
        </section>
    )
}

export default BuyAsset;