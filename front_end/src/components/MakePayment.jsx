import { useEffect, useState } from "react"
import btcImage from "../assets/bitcoin.png"
import ltcImage from "../assets/ltc.png"
import ethImage from "../assets/ETH.png"
import dogeImage from "../assets/dogecoin.jpg"
import { transactions } from "../api/Api";
import { Copy, ExternalLink, CheckCircle, Clock, QrCode, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf'


const MakePayment = ({setShowAddMoneyModal}) => {

    const [paymentData, setPaymentData] = useState({
        price_amount: '',
        price_currency: 'usd',
        pay_amount: '',
        pay_currency: 'btc',
        order_id: ''
    })
    const [payment, setPayment] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [step, setStep] = useState('form');
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900);

    

    const handleConversion = (currency) => {
        if (paymentData.pay_currency === 'btc') return 115000
        if (paymentData.pay_currency === 'eth') return 4000      
        if (paymentData.pay_currency === 'ltc') return  200
        
        return 10
    }
    
    const generate_Id = () => {
        const randomPart = Math.random().toString(36).substring(2, 10);
        return `ORDER-${randomPart.toUpperCase()}`
    }
    

    useEffect(() => {
        if (step === 'invoice' && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000);
            return () => clearInterval(timer)
        }
    }, [step, timeLeft])

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds/60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    };

    const handleInputChange = (e) => {

        const {name, value} = e.target
        const num = parseFloat(value)
        
        const currentCoinPrice = handleConversion(paymentData.pay_currency)

        setPaymentData( (prev) => {
            const newData = {
                ...prev,
                [name]: value,
            }

            return {
                ...newData,
                pay_amount: parseFloat((newData.price_amount || 0)/currentCoinPrice),
                price_amount: name === 'price_amount' ? num : newData.price_amount,
                order_id: generate_Id()
            }
            
     
        })

    }

    const images = {
        dogeCoin: dogeImage,
        ltc: ltcImage,
        eth: ethImage,
        btc: btcImage
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {
            console.log("sending to API:", paymentData)
            const response = await transactions.create_payment(paymentData)
            setPayment(response.data)
            setStep('invoice')
            console.log("payment data:", response.data)
            

        } catch(error) {
            setErrorMessage(error)
            console.error("Error creating payment:", error)
        }
         
    }

    const simulatePayment = () => {
        setStep('success')
    }

    const downloadReceipt = () => {
        const doc = new jsPDF

        // Title
        doc.setFontSize(18)
        doc.text("Payment Receipt", 20, 20);

        // Divider
        doc.setLineWidth(0.5)
        doc.line(20, 25, 190, 25)

        // Content
        doc.setFontSize(12)
        doc.text(`Payment ID: ${payment.payment_id}`, 20, 40);
        doc.text(`Order ID: ${paymentData.order_id}`, 20, 50);
        doc.text(`Amount Paid: ${payment.pay_amount} ${payment.pay_currency.toUpperCase()}`, 20, 60);
        doc.text(`Status: Confirmed`, 20, 70);
        doc.text(`Date: ${new Date().toLocaleString()}`, 20, 80);

         // Footer
        doc.setFontSize(10);
        doc.text("Thank you for your payment!", 20, 100);

        // Save
        doc.save(`receipt-${payment.payment_id}.pdf`);

        setShowAddMoneyModal(false)

        
    }
    if (step === 'form') {
    return (
        <form className="absolute inset-0 h-screen bg-white z-30 p-4" onSubmit={handleSubmit}>
            <h2 className="mb-4">Deposit Crypto to Wallet</h2>

            <div className="my-4">
                <label>Amount</label>
                <span className="relative top-8 left-4">$</span>
                
                <input 
                    className="border w-full rounded-2xl py-2 px-7" 
                    placeholder="0.00" 
                    name="price_amount"
                    value={paymentData.price_amount} 
                    onChange={handleInputChange}
                />
            </div>

            <div className="mb-4">
                <label>
                    Pay with
                </label>
                <select 
                    name="pay_currency"
                    value={paymentData.pay_currency}
                    onChange={handleInputChange}
                    className="border w-full rounded-2xl py-2 px-7"
                >
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth"> Ethereum (ETH)</option>
                    <option value="ltc"> Litecoin (LTC)</option>
                    <option value="dogeCoin">Dogecoin (DOGE)</option>
                </select>
            </div>
            <div className="flex flex-row items-center my-1">
                <img src={images[paymentData.pay_currency] || btcImage} alt="solana icon" className="w-6 h-6 mr-1" />
                <p>{paymentData.pay_amount}</p>
            </div>
            
            
            <button 
                className="bg-green-500 w-full rounded-2xl my-3" 
                type="submit"
            >
                Deposit
            </button>

        </form>
    )}

    if (step === 'invoice') {
        return (
            <div className="absolute inset-0 z-30 max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                        <Clock className="w-8 h-8 text-orange-600"/>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">payment Invoice</h2>
                    <p className="text-gray-600">Send exactly the amount shown below</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-red-700 font-medium">Time Remaining:</span>
                        <span className="text-red-700 font-bold text-xl">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Order Amount: </span>
                            <span className="font-bold">
                                {paymentData.price_amount} {paymentData.price_currency.toUpperCase()}
                            </span>

                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Pay Amount</span>
                            <span className="font-bold text-lg">{paymentData.pay_amount}{paymentData.pay_currency.toUpperCase()}</span>

                        </div>

                    </div>

                    {/* Payment Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Send {paymentData.pay_currency.toUpperCase()} to this address:
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={payment.pay_address}
                                readOnly 
                                className="w-full p-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
                            />
                            <button 
                                onClick={() => copyToClipboard(payment.pay_address)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <Copy className="w-4 h-4"/>
                                

                            </button>
                        </div>
                        {copied && (
                            <p className="text-green-600 text-sm mt-1">Address copied!</p>
                        )}
                    </div>
                </div>

                 {/* QR Code Placeholder */}
                <div className="flex justify-center mb-6">
                <div className="w-48 h-48 bg-gray-100 border-2 border-dashed boNew .ca domains now available

agricalpha.crder-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                    <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">QR Code would appear here</p>
                    </div>
                </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                <a
                    href={payment.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                    <ExternalLink className="w-4 h-4" />
                    Open Full Invoice Page
                </a>
                
                <button
                    onClick={simulatePayment}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                    🧪 Simulate Payment (Sandbox Only)
                </button>
                
                <button
                    onClick={() => setStep('form')}
                    className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Back to Form
                </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                Payment ID: {payment.payment_id}
                </div>
                </div>
        )
    }

    if (step === 'success') {
    return (
      <div className="absolute  inset-0  z-40 mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <button>
            <ArrowLeft/>
        </button>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your payment has been successfully processed.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-mono">{payment.payment_id}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-bold">
                {payment.pay_amount} {payment.pay_currency.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600 font-medium">Confirmed</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setStep('form');
            setPayment(null);
            setTimeLeft(900);
          }}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create New Payment
        </button>
        <button
  onClick={downloadReceipt}
  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors mt-3"
>
  Save Receipt (PDF)
</button>
      </div>
    );
  }
}

export default MakePayment;