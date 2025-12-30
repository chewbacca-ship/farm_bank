import { InfoIcon, Cog, MessageCircle, PhoneIcon, XIcon, PlusIcon, MinusIcon, BarChart, Send } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { dataBase } from "../api/Api";

const ManageInvestment = ({currentInvestment, setShowManageInvestment}) => {
    const [currentTab, setCurrentTab] = useState('Action')
    const [showAddFunds, setShowAddFunds] = useState(null)
    const [showWithdrawFunds, setShowWithdrawFunds] = useState(null)
    const [showTransferInvestment, setShowTransferInvestment] = useState(null);
    const [showExitInvestment, setShowExitInvesment] = useState(null)
    const [amountToAdd, setAmountToAdd] = useState('')
    const [amountToWithdraw, setAmountToWithdraw] = useState('')
    const [WithdrawPercentage, setWithdrawalPercentage] = useState(null)
    const withdrawalAmount = parseFloat(amountToWithdraw) || 0;
    const basicPenalty = withdrawalAmount * 0.02;   // 2%
    const earlyStagePenalty = withdrawalAmount * 0.008; // 0.8%
    const totalPenalties = basicPenalty + earlyStagePenalty;
    const netAmount = withdrawalAmount - totalPenalties;
    const remainingInvestment = currentInvestment.amount_invested - withdrawalAmount;
    const expectedRate = currentInvestment.expected_return || 0; 
    const futureReturnImpact = withdrawalAmount * (expectedRate/100);
    console.log(currentInvestment)

    // Add Funds / Update
const addMutation = useMutation({
    mutationFn: (payload) => dataBase.updateInvestment(payload),
    onError: (error) => {
        console.error("Add Mutation error:", error);
    },
    onSuccess: (data) => {
        console.log("Add Success:", data);
    },
});

// Withdrawal
const withdrawMutation = useMutation({
    mutationFn: (payload) => dataBase.withdrawInvestment(payload),
    onError: (error) => {
        console.error("Withdraw Mutation error:", error);
    },
    onSuccess: (data) => {
        console.log("Withdraw Success:", data);
    },
});

    const transferMutation = useMutation({
    mutationFn: (payload) => dataBase.transferInvestment(payload),
    onError: (error) => {
        console.error("Transfer Mutation error:", error);
    },
    onSuccess: (data) => {
        console.log("Transfer Success:", data);
    },
});


    const handleAddAmount = (e) => {
        const {value} = e.target
        setAmountToAdd(value)
    }

    const handleWithdrawAmount = (e) => {
        const {value} = e.target
        setAmountToWithdraw(value)
    }
    const handleAdd = () => {
        addMutation.mutate(
            {
                investment_id: currentInvestment.id,
                amount: amountToAdd
            },
            {
                onSettled: () => {
                    setShowManageInvestment(false)
                }
            }
        )
    }

    const handleWithdrawal = () => {
    withdrawMutation.mutate(
        {
            investment_id: currentInvestment.id,
            withdrawal_amount: amountToWithdraw   // use withdrawal_amount instead of amount
        },
        {
            onSettled: () => {
                
            }
        }
    )
}

    const handleTransfer = () => {  
        transferMutation.mutate(
            {
                investment_id: currentInvestment.id,
                transfer_amount: amountToWithdraw   // use transfer_amount instead of amount
            },
            {            onSettled: () => {
            
                }
            }
        )
    }

    const handleWithdrawPercentage = (percent) => {
        const calculatedAmount = (currentInvestment.amount_invested * percent)/ 100
        setWithdrawalPercentage(percent)
        setAmountToWithdraw(calculatedAmount.toFixed(2))
    }

    return (
        <section className=" absolute z-30 top-56 left-[500px] border-transparent w-[700px] bg-white p-8 rounded-md shadow-2xl">
            <div className="flex flex-row justify-between items-center">
                <h3 className="flex flex-row items-center font-bold"> 
                    <Cog className="h-4 w-4 mr-2"/> 
                    Manage {currentInvestment.title}
                </h3>
                <button 
                    className="font-bold cursor-pointer"
                    onClick={() => setShowManageInvestment(false)}
                >
                    <XIcon/>
                </button>
            </div>
            <header 
                className=" flex flex-row justify-between bg-gray-200 p-1.5 rounded-3xl my-4"
            >
                <button 
                    onClick={() => setCurrentTab('Action')} 
                    className={`${currentTab === 'Action' ? "bg-white transition-normal" : "text-black"} py-2 px-4 rounded-3xl `}
                >
                    Actions
                </button>
                <button 
                    className={`${currentTab === 'Documents' ? "bg-white " : "text-black"} p-2 rounded-2xl `}
                >
                    Documents
                </button>
                <button onClick={() => setCurrentTab('Support')} className={`${currentTab === 'Support' ? "bg-white " : "text-black"} py-2 px-4 rounded-3xl `}>Support</button>
            </header>
            {currentTab === 'Action' && (
                <div>
                    { !showAddFunds && !showWithdrawFunds && !showTransferInvestment && !showExitInvestment && 
            
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border-3 border-gray-300 shadow-lg p-4 rounded-lg ">
                            <h5 className="font-bold "> <span className="mr-2 text-green-500 font-bold ">+</span>Increase Investment</h5>
                            <p className="my-4">Add more funds to this investment to potentially increase returns.</p>
                            <button className="bg-gray-900 text-white p-2 rounded-lg w-full" onClick={() => setShowAddFunds(true)}>+ Add Funds</button>
                        </div>
                        <div className="border-3 border-gray-300 shadow-lg p-4 rounded-lg ">
                            <h5><span>-</span>Partial Withdrawal</h5>
                            <p className="my-4">Withdraw a portion of your investment</p>
                            <button className="bg-amber-600 text-white p-2 rounded-lg w-full" onClick={setShowWithdrawFunds}>- Withdraw Funds</button>
                        </div>
                        <div className="border-3 border-gray-300 shadow-lg p-4 rounded-lg">
                            <h5 className="font-bold">Transfer Investment</h5>
                            <p className="my-4">Transfer your investment to another person or entity.</p>
                            <button className="bg-blue-600 text-white p-2 rounded-lg w-full" onClick={() => setShowTransferInvestment(true)}>Transfer Investment</button>
                        </div>
                        <div className="border-3 border-gray-300 shadow-lg p-4 rounded-lg">
                            <h5 className="flex flex-row text-red-600"><InfoIcon className="mr-2"/> Exit Investment</h5>
                            <p className="my-4">Completely exit this investment. This action may incur penalties.</p>
                            <button className="bg-red-600 text-white p-2 rounded-lg w-full">Exit Investment</button>
                        </div>
                    </div>}
                    {showAddFunds && 
                    <form>
                        <div className="flex flex-row justify-between items-center">
                            <h5 className="font-bold text-xl my-4">Add Funds</h5>
                            <XIcon/>
                        </div>

                        <div className="border bg-blue-50 border-blue-50 px-8 py-4 rounded-xl mb-3">
                            <h6 className="font-bold text-blue-900 flex flex-row items-center mb-3">
                                <PlusIcon className="h-5 w-5 mr-1 "/>
                                Invesment Summary
                            </h6>
                            <div className="flex flex-row justify-between items.center  rounded-xl  ">
                                <div>
                                    <h6>Current Investment</h6>
                                    <p className="my-2">${currentInvestment.amount_raised.toLocaleString()}</p>
                                </div>
                                <div>
                                    <h6>New Investment</h6>
                                    <p className="my-2">${(currentInvestment.amount_raised+30000).toLocaleString()}</p>
                                </div>
                            </div>

                           
                        </div>

                            <div>
                                <label htmlFor="new investment aount">
                                    <span className="text-sm font-bold">New Investment Amount</span>
                                    <input  value={amountToAdd} onChange={handleAddAmount} className="border-3 bg-gray-50 border-blue-50 p-2 rounded-xl w-full" />
                                </label>
 

                                <select className="border-3 border-blue-50 bg-gray-50  w-full p-2 rounded-xl mt-3">
                                    <option className="" value="">Select payment method</option>
                                    <option value="">Bank Transfer</option>
                                    <option value="">Wallet</option>
                                </select>
                        </div>
                        <div className="flex flex-row justify-between items-center my-4">
                            <button 
                                className="w-1/3 border border-blue-200 shadow-2xl p-2 rounded-2xl" 
                                 onClick={handleAdd}
                                type="button"
                            >Add</button>
                            <button className="w-1/3 border border-red-600 shadow-2xl p-2 rounded-2xl">Cancel</button>
                        </div>
                        
                    </form>}
                     { showWithdrawFunds &&
                    <form>
                        <div className="flex flex-row justify-between items-center">
                            <h5 className="font-bold text-xl my-4">Withdraw Funds</h5>
                            <button onClick={() => setShowWithdrawFunds(false)}>
                                <XIcon/>
                            </button>
                        </div>
                        <div className="bg-red-50 p-3 rounded-2xl my-4">
                            <div className="flex flex-row items-center my-2 ">
                                <InfoIcon className=" h-4 w-4 text-red-600 mr-2" />
                                <h6 className="text-red-600">Important Notice</h6>

                            </div>
                            <p className="text-red-500">Exiting this investment early will result in penalties and you may lose potential future returns</p>
                        </div>

                        <div className="border bg-gray-50 border-blue-50 px-8 py-4 rounded-xl mb-3">
                            <h6 className="font-bold  flex flex-row items-center mb-3 text-red-600">
                                <MinusIcon className="h-5 w-5 mr-1 "/>
                                Withdraw Funds
                            </h6>
                            <div className="flex flex-row justify-between items.center  rounded-xl  ">
                                <div>
                                    <h6>Current Investment Value</h6>
                                    <p className="my-2">${currentInvestment.amount_invested.toLocaleString()}</p>
                                </div>
                                <div>
                                    <h6>Processing time</h6>
                                    <p className="my-2">3 -5 Business days</p>
                                </div>
                            </div>

                           
                        </div>

                            <div>
                                <label htmlFor="new investment aount">
                                    <span className="text-sm font-bold">Withdrawal Amount</span>
                                    <input placeholder="Enter amount" value={amountToWithdraw} onChange={handleWithdrawAmount} className="border-3 bg-gray-50 border-blue-50 p-2 rounded-xl w-full" />
                                    <div className="flex flex-row justify-end my-3">
                                        <button className="border mr-2 p-2 rounded-lg" type="button" onClick={() => handleWithdrawPercentage(25)}>25%</button>
                                        <button className="border mr-2 p-2 rounded-lg" type="button" onClick={() => handleWithdrawPercentage(50)}>50%</button>
                                        <button className="border mr-2 p-2 rounded-lg" type="button" onClick={() => handleWithdrawPercentage(75)}>75%</button>
                                        <button className="border mr-2 p-2 rounded-lg" type="button" onClick={() => handleWithdrawPercentage(100)}>100%</button>
                                    </div>
                                </label>
 

                                <select className="border-3 border-blue-50 bg-gray-50  w-full p-2 rounded-xl mt-3">
    <option value="">Select reason</option>
    <option value="Personal Expenses">Personal Expenses</option>
    <option value="Emergency">Emergency</option>
    <option value="Other Investment Opportunity">Other Investment Opportunity</option>
    <option value="Portfolio Rebalancing">Portfolio Rebalancing</option>
    <option value="Other">Other</option>
</select>

{WithdrawPercentage  && (
    <div className="mt-4">
        <div  className="bg-yellow-50 p-4 rounded-xl">
        <h6 className="flex items-center text-red-600 font-bold">
            <InfoIcon className="h-4 w-4 mr-2"/> Withdrawal Penalties
        </h6>
        <div className="flex justify-between my-2">
            <div>
                <h6>Withdraw Amount</h6>
                <p>${withdrawalAmount.toLocaleString()}</p>
            </div>
            <div>
                <h6>Withdrawal Percentage</h6>
                <p>{WithdrawPercentage}%</p>
            </div>
        </div>

        <div className="border-t border-b py-2 my-2">
            <div className="flex justify-between">
                <h6>Basic withdrawal penalty (2%)</h6>
                <p>${basicPenalty.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
                <h6>Early Stage penalty (0.8%)</h6>
                <p>${earlyStagePenalty.toFixed(2)}</p>
            </div>
        </div>

        <div className="flex justify-between my-2">
            <h6>Total penalties</h6>
            <p>${totalPenalties.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-bold text-green-700">
            <h6>Net Amount you will receive</h6>
            <p>${netAmount.toFixed(2)}</p>
        </div>
        </div>

        <div className="mt-4 border  p-4 rounded-xl">
            <div  className="flex flex-row items-center">
                <BarChart className="mr-2 h-4 w-4"/>
                 <h6 className="font-bold">Investment Summary Impact</h6>
                
            </div>
           
            <div className="flex justify-between my-2">
                <div>
                    <h6> Remaining Investment</h6>
                    <p>${remainingInvestment.toLocaleString()}</p>
                </div>
                <div>
                    <h6>Future return impact</h6>
                        <p>
                            You may lose approx. ${futureReturnImpact.toFixed(2)} in future returns
                        </p>
                </div>
            </div>
        </div>
    </div>
)}

                        </div>
                        <div className="flex flex-row justify-between items-center my-4">
                            <button 
                                className="w-1/3 border border-blue-200 shadow-2xl p-2 rounded-2xl" 
                                onClick={() => handleWithdrawal()}
                                type="button"
                            >
                                Withdraw
                            </button>
                            <button className="w-1/3 border border-red-600 shadow-2xl p-2 rounded-2xl">Cancel</button>
                        </div>
                        
                    </form>}
                     { showTransferInvestment &&
                    <form>
                        <div className="flex flex-row justify-between items-center">
                            <h5 className="font-bold text-xl my-4">Transfer Funds</h5>
                            <button onClick={() => setShowWithdrawFunds(false)}>
                                <XIcon/>
                            </button>
                        </div>
                        <div className="bg-red-50 p-3 rounded-2xl my-4">
                            <div className="flex flex-row items-center my-2 ">
                                <InfoIcon className=" h-4 w-4 text-red-600 mr-2" />
                                <h6 className="text-red-600">Important Notice</h6>

                            </div>
                            <p className="text-red-500">Carefully cross check your decision, this cannot be undone!</p>
                        </div>

                        <div className="border bg-gray-50 border-blue-50 px-8 py-4 rounded-xl mb-3">
                            <h6 className="font-bold  flex flex-row items-center mb-3 text-blue-600">
                                <Send className="h-5 w-5 mr-1 "/>
                                Transfer Funds
                            </h6>
                            <div className="flex flex-row justify-between items.center  rounded-xl  ">
                                <div>
                                    <h6>Current Investment Value</h6>
                                    <p className="my-2">${currentInvestment.amount_invested.toLocaleString()}</p>
                                </div>
                                <div>
                                    <h6>Processing time</h6>
                                    <p className="my-2 text-blue-600 font-bold">Immediate</p>
                                </div>
                            </div>

                           
                        </div>

                            <div>
                                <label htmlFor="new investment aount">
                                    <span className="text-sm font-bold">Transfer Amount</span>
                                    <input placeholder="Enter amount" value={amountToWithdraw} onChange={handleWithdrawAmount} className="border-3 bg-gray-50 border-blue-50 p-2 rounded-xl w-full" />
                                    <div className="flex flex-row justify-end my-3">
                                        <button className="border mr-2 p-2 rounded-lg" type="button" onClick={() => handleWithdrawPercentage(25)}>25%</button>
                                        <button className="border mr-2 p-2 rounded-lg" type="button" onClick={() => handleWithdrawPercentage(50)}>50%</button>
                                        <button className="border mr-2 p-2 rounded-lg" type="button" onClick={() => handleWithdrawPercentage(75)}>75%</button>
                                        <button className="border mr-2 p-2 rounded-lg" type="button" onClick={() => handleWithdrawPercentage(100)}>100%</button>
                                    </div>
                                </label>



{WithdrawPercentage  && (
    <div className="mt-4">
        <div  className="bg-blue-50 p-4 rounded-xl">
        <h6 className="flex items-center text-blue-600 font-bold">
            <InfoIcon className="h-4 w-4 mr-2"/> Withdrawal Info
        </h6>
        <div className="flex justify-between my-2">
            <div>
                <h6>Transfer Amount</h6>
                <p>${withdrawalAmount.toLocaleString()}</p>
            </div>
            <div>
                <h6>Transfer Percentage</h6>
                <p>{WithdrawPercentage}%</p>
            </div>
        </div>

     

       
        <div className="flex justify-between font-bold text-green-700">
            <h6>Net Amount Transfered</h6>
            <p>${netAmount.toFixed(2)}</p>
        </div>
        </div>

        <div className="mt-4 border-blue-50  p-4 rounded-xl bg-blue-50">
            <div  className="flex flex-row items-center">
                <BarChart className="mr-2 h-4 w-4"/>
                 <h6 className="font-bold">Investment Summary Impact</h6>
                
            </div>
           
            <div className="flex flex-col justify-between my-2">
                <div className="mb-3 border-b-2 pb-3" >
                    <h6 className="text-sm"> Remaining Portfolio Balance </h6>
                    <p className="font-bold text-4xl">${remainingInvestment.toLocaleString()}</p>
                </div>
                <div>
                    
                        <p>
                            You may see an estimated change of <span className="font-bold">${futureReturnImpact.toFixed(2)}</span> in future returns
                        </p>
                </div>
            </div>
        </div>
    </div>
)}

                        </div>
                        <div className="flex flex-row justify-between items-center my-4">
                            <button 
                                className="flex flex-row justify-center items-center w-1/3 border border-blue-200 shadow-2xl p-2 rounded-2xl" 
                                onClick={() => handleTransfer()}
                                type="button"
                            >
                                <Send className="h-4 w-4 mr-2"/>
                                Transfer
                            </button>
                            <button className="w-1/3 border border-red-600 shadow-2xl p-2 rounded-2xl">Cancel</button>
                        </div>
                        
                    </form>}
                </div>)}
            {currentTab === 'Support' && (
                <div>
                    <div className="flex flex-row"> 
                        <div className="border-2 border-blue-200 p-3 rounded-xl mr-1">
                            <h4 className="flex flex-row font-bold"> 
                                <MessageCircle className="text-blue-600 mr-2"/> 
                                Contact Support
                            </h4>
                            <p className="my-2">Get help with your questions or concerns.</p>
                            <button className="bg-gray-950 text-white p-2 rounded-xl">Start a Chat</button>
                        </div>
                        <div className="border-2 border-green-200 p-3 rounded-xl ml-1">
                            <h4 className="flex flex-row font-bold">
                                <PhoneIcon className="text-green-600 mr-2"/>
                                Schedule a Call
                            </h4>
                            <p className="my-2">Schedule a call with your investment advisor.</p>
                            <button className="flex flex-row items-center border-2 border-gray-300 p-2 rounded-xl">
                                <PhoneIcon className="h-4 w-4 mr-2"/>
                                Book Call
                            </button>
                        </div>

                    </div>

                    <article>
                <h3>Frequently Asked Question</h3>
               
            </article>
                   
                </div>
            )}
            
        </section>
    )


}

export default ManageInvestment;