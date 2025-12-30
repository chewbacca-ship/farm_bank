import {ArrowRight, ArrowLeft, DollarSign, CheckCircle, CreditCard,  PiggyBank, Building2, InfoIcon, Shield, Calendar, TrendingUp, Users, MapPin, FileText, Clock } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {toast} from "sonner"
import useProfile from "../hooks/useProfile";
import { dataBase } from "../api/Api";

const InvestNow = ({investmentOpportunity, setShowInvestNowModal}) => {
    const [currentStep, setCurrentStep] = useState('amount')
    const [investmentAmount, setInvestmentAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('bank')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState("")

    const {data: profile} = useProfile()
    const balance = profile?.account?.wallet_balance || 0

    const quickAmounts = [
        investmentOpportunity.min_investment,
        investmentOpportunity.min_investment * 2,
        investmentOpportunity.min_investment * 5,
        investmentOpportunity.min_investment * 10
    ];

    const fees = {
        platformFee: 0.025, // 2.5%
        processingFee: 0.005 // 0.5%
    };

    const getRiskBadgeClasses = (riskLevel) => {
      switch (riskLevel) {
        case "Low":
        case "Low-Medium":
          return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "Medium":
          return "border-amber-200 bg-amber-50 text-amber-700";
        case "Medium-High":
          return "border-orange-200 bg-orange-50 text-orange-700";
        case "High":
          return "border-rose-200 bg-rose-50 text-rose-700";
        default:
          return "border-slate-200 bg-slate-100 text-slate-600";
      }
    };

    const investmentValue = parseFloat(investmentAmount) || 0;
    const platformFee = investmentValue * fees.platformFee;
    const processingFee = investmentValue * fees.processingFee;
    const totalAmount = investmentValue + platformFee + processingFee;

    const projectedReturns = {
        low: investmentValue * 0.12, // 12% (conservative)
        high: investmentValue * 0.18 // 18% (optimistic)
    };

    const mutation = useMutation({
      mutationFn: (payload) => dataBase.addInvestment(payload),
      onSuccess: () => {
        toast.success(
          `Investment of $${investmentAmount} in ${investmentOpportunity.name} confirmed! 🎉`,
          {style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            height: "15px"
          }}
        )   
      },
      onError: () => {
        toast.error("Something went wrong with processing your investment")
      }
    })

    console.log(investmentOpportunity.id)

    const handleNext = () => {
        if (currentStep === 'amount' && investmentValue >= investmentOpportunity.min_investment) {
            setCurrentStep('review');
        } else if (currentStep === 'review' && agreedToTerms) {
            setCurrentStep('payment');
        } else if (currentStep === 'payment') {
            setIsProcessing(true);
            
            mutation.mutate(
              {
                opportunity_id: investmentOpportunity.id,
                amount: investmentValue,
              },
              {
                onSettled: () => {
                  setIsProcessing(false);
                  setCurrentStep("success");
                },
              }
            );
            
        }
    };

    const handleBack = () => {
        if (currentStep === 'review') {
        setCurrentStep('amount');
        } else if (currentStep === 'payment') {
      setCurrentStep('review');
        }
    };

    const handleClose = () => {
        setCurrentStep('amount');
        setInvestmentAmount('');
        setPaymentMethod('bank');
        setAgreedToTerms(false);
        setIsProcessing(false);
        setShowInvestNowModal(false)
        
    };


    const getStepNumber = () => {
        switch (currentStep) {
            case 'amount': return 1;
            case 'review': return 2;
            case 'payment': return 3;
            case 'success': return 4;
            default: return 1;
        }
    };


  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border border-transparent ${
              step <= getStepNumber() 
                ? 'bg-gray-900 text-white  font-bold' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              {step}
            </div>
            {step < 4 && (
              <div className={`w-12 h-.5 ml-2 border ${
                step < getStepNumber() ? 'bg-white' : 'bg-white'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

    const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 font-bold text-2xl">How much would you like to invest?</h3>
        <p className="text-muted-foreground text-xl text-gray-500">
          Minimum investment: ${investmentOpportunity.min_investment.toLocaleString()}
        </p>
      </div>
 
      <div className="space-y-4  ">
        <div className="space-y-2">
          <label htmlFor="amount" className="font-bold ">Investment Amount</label>
          <div className="relative w-full">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="amount"
              placeholder="0"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="pl-10 border-2 w-full py-2 rounded-lg mt-1"
              min={investmentOpportunity.min_investment}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => setInvestmentAmount(amount.toString())}
              className="h-auto py-3 border border-gray-300 rounded-xl shadow-md"
            >
              <div className="text-center">
                <div className="font-medium">${amount.toLocaleString()}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {investmentValue > 0 && (
        <div className="border p-8 rounded-xl">
          <div className="pb-3">
            <h4 className="text-lg font-bold mb-4">Investment Projection</h4>
          </div>
          <div className="space-y-3 ">
            <div className="grid grid-cols-2 gap-4 text-base">
              <div>
                <h5 className="text-gray-500 ">Investment Amount</h5>
                <p className="font-medium ">${investmentValue.toLocaleString()}</p>
              </div>
              <div>
                <div className=" text-gray-500">Expected Duration</div>
                <div className="font-medium">{investmentOpportunity.duration_months}Months</div>
              </div>
              <div>
                <div className="text-gray-500">Expected Return Range</div>
                <div className="font-medium text-green-600">{investmentOpportunity.expected_return}%</div>
              </div>
              <div>
                <div className="text-muted-foreground text-gray-500">Projected Profit</div>
                <div className="font-medium text-green-600">
                  ${projectedReturns.low.toLocaleString()} - ${projectedReturns.high.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {investmentValue > 0 && investmentValue < investmentOpportunity.min_investment && (
        <div className="flex flex-row items-center text-red-500">
          <InfoIcon className="h-4 w-4 mr-2" />
          <div>
            Investment amount must be at least ${investmentOpportunity.min_investment.toLocaleString()}.
          </div>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => {
    const riskLevel = investmentOpportunity.riskLevel || investmentOpportunity.risk_level || "Moderate";
    const riskBadgeClass = getRiskBadgeClasses(riskLevel);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="mb-2 text-2xl font-bold text-slate-900">Review your investment</h3>
          <p className="text-base text-slate-500">
            Double‑check the numbers and the opportunity highlights before moving forward.
          </p>
        </div>

        <div className="space-y-6">
          {/* Investment Summary */}
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                Investment Summary
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                Step 2 of 3
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-700">Investment Amount</p>
                <p className="text-3xl font-semibold text-emerald-900 mt-1">${investmentValue.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">Minimum required: ${investmentOpportunity.min_investment.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-900/90 p-4 text-white">
                <p className="text-sm font-medium text-white/80">Total including fees</p>
                <p className="text-3xl font-semibold mt-1">${totalAmount.toFixed(2)}</p>
                <p className="text-xs text-white/70 mt-1">Platform + processing fees included</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-blue-900">Platform Fee</p>
                  <p className="text-xs text-blue-600">2.5% service charge</p>
                </div>
                <p className="text-lg font-semibold text-blue-900">${platformFee.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-amber-900">Processing Fee</p>
                  <p className="text-xs text-amber-600">0.5% payment handling</p>
                </div>
                <p className="text-lg font-semibold text-amber-900">${processingFee.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Opportunity Details */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Opportunity</p>
                <h2 className="text-xl font-semibold text-slate-900">{investmentOpportunity.name}</h2>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {investmentOpportunity.location}
                </p>
              </div>
              <span className={`inline-flex w-fit items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${riskBadgeClass}`}>
                <Shield className="h-3.5 w-3.5" />
                {riskLevel} risk
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{investmentOpportunity.description}</p>

            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                <p className="text-xs uppercase text-slate-500">Expected return</p>
                <p className="text-lg font-semibold text-emerald-700 mt-1">{investmentOpportunity.expected_return}%</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                <p className="text-xs uppercase text-slate-500">Duration</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{investmentOpportunity.duration_months} months</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                <p className="text-xs uppercase text-slate-500">Investors</p>
                <p className="text-lg font-semibold text-slate-900 mt-1 flex items-center gap-1">
                  <Users className="h-4 w-4 text-slate-400" />
                  {investmentOpportunity.investors}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                <p className="text-xs uppercase text-slate-500">Funding progress</p>
                <p className="text-lg font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  {Math.round(investmentOpportunity.fundingProgress || 0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
          <input
            id="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(event) => setAgreedToTerms(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="terms" className="text-sm leading-relaxed text-slate-600">
            I have read and agree to the{" "}
            <button className="font-medium text-emerald-600 hover:underline">Investment Terms</button>,{" "}
            <button className="font-medium text-emerald-600 hover:underline">Risk Disclosure</button>, and{" "}
            <button className="font-medium text-emerald-600 hover:underline">Privacy Policy</button>. I understand that this
            investment carries risk and past performance does not guarantee future results.
          </label>
        </div>
      </div>
    );
  };

  const renderPaymentStep = () => {
    const paymentOptions = [
      {
        id: "bank",
        title: "Bank transfer (ACH)",
        description: "Secure transfer directly from your bank account.",
        icon: Building2,
        accent: "text-blue-600",
        badge: "1-2 business days",
        fee: "No additional fees",
      },
      {
        id: "debit",
        title: "Debit card",
        description: "Instant funding with your debit card.",
        icon: CreditCard,
        accent: "text-green-600",
        badge: "Instant",
        fee: "+$5 processing fee",
      },
      {
        id: "wallet",
        title: "AgriInvest wallet",
        description: "Use your available wallet balance for the fastest settlement.",
        icon: PiggyBank,
        accent: "text-purple-600",
        badge: "Instant • Recommended",
        fee: `${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available`,
        recommended: true,
      },
    ];

    const selected = paymentOptions.find((option) => option.id === paymentMethod);
    const SelectedIcon = selected?.icon;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="mb-2 text-2xl font-semibold text-slate-900">Choose payment method</h3>
          <p className="text-sm text-slate-500">
            Select how you’d like to fund this investment. You can switch methods anytime before confirming.
          </p>
        </div>

        {selected && SelectedIcon && (
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Selected method</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SelectedIcon className={`h-5 w-5 ${selected.accent}`} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{selected.title}</p>
                  <p className="text-xs text-slate-500">{selected.description}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                In use
              </span>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = paymentMethod === option.id;
            return (
              <button
                type="button"
                key={option.id}
                onClick={() => setPaymentMethod(option.id)}
                className={`flex w-full flex-col gap-3 rounded-3xl border p-4 text-left transition focus:outline-none ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-50/80 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${option.accent}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                    <p className="text-xs text-slate-500">{option.description}</p>
                  </div>
                  {option.recommended && (
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                    {option.badge}
                  </span>
                  <span className="font-medium text-slate-700">{option.fee}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
          <Shield className="h-5 w-5 text-emerald-600" />
          <p>
            Payments are protected with bank-level encryption. We never store your full card or banking details, and every
            transaction is monitored for fraud 24/7.
          </p>
        </div>

        {isProcessing && (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500"></div>
            <p className="text-sm text-slate-500">Processing your investment...</p>
          </div>
        )}
      </div>
    );
  };

  const renderSuccessStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Investment confirmed!</h3>
          <p className="text-sm text-slate-500">
            You’ve successfully invested ${investmentValue.toLocaleString()} in {investmentOpportunity.name}. We’ll keep you updated as it
            progresses.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Investment receipt</p>
            <p className="text-sm font-semibold text-slate-900">Reference ID</p>
            <p className="text-lg font-mono text-slate-700">INV-{Date.now().toString().slice(-6)}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Confirmed</span>
        </div>

        <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
            <p className="text-xs uppercase text-slate-500">Investment amount</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">${investmentValue.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
            <p className="text-xs uppercase text-slate-500">Expected return</p>
            <p className="text-lg font-semibold text-emerald-700 mt-1">{investmentOpportunity.expected_return}%</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
            <p className="text-xs uppercase text-slate-500">Duration</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">{investmentOpportunity.duration_months} months</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
            <p className="text-xs uppercase text-slate-500">Payment method</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">
              {paymentMethod === "bank"
                ? "Bank transfer (ACH)"
                : paymentMethod === "debit"
                  ? "Debit card"
                  : "AgriInvest wallet"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-semibold text-slate-900">What happens next?</p>
            <p>
              We’ll send your first update within 30 days. You can track live performance anytime from your dashboard and
              download a full receipt from your activity log.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleClose}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Go to portfolio
        </button>
        <button
          onClick={handleClose}
          className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          Make another investment
        </button>
      </div>
    </div>
  );



    return (
        <section className=" absolute z-30 top-56 border-transparent w-[700px] bg-white p-8 rounded-md shadow-2xl">
            <div>
                <h1 className="font-bold text-2xl my-2">
                    {currentStep === 'success' ? "Investment Complete" : "Invest in" + investmentOpportunity.name}
                </h1>
                {currentStep !== 'success' && (
                    <h2 className="text-gray-500 mb-2"> 
                        Step {getStepNumber()} of 4 - {
                            currentStep === 'amount' ? 'Investment Amount' :
                            currentStep === 'review' ? 'Review Details' :
                            currentStep === 'payment' ? 'Payment Method' : 'Complete'
                        }
                    </h2>
                )}
                
            </div>

            <div className="py-4">
                {currentStep !== 'success' && renderStepIndicator()}
                
                {currentStep === 'amount' && renderAmountStep()}
                {currentStep === 'review' && renderReviewStep()}
                {currentStep === 'payment' && renderPaymentStep()}
                {currentStep === 'success' && renderSuccessStep()}
            </div>

            {currentStep !== 'success' && !isProcessing && (
          <div className="flex justify-between my-3">
            <button  
              onClick={currentStep === 'amount' ? handleClose : handleBack}
              className="gap-2 flex flex-row items-center p-2 border border-gray-300 rounded-lg "
            >
              {currentStep === 'amount' ? 'Cancel' : (
                <>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </>
              )}
            </button>
            <button 
              onClick={handleNext}
              disabled={
                (currentStep === 'amount' && investmentValue < investmentOpportunity.min_investment) ||
                (currentStep === 'review' && !agreedToTerms)
              }
              className="gap-2 flex flex-row items-center border-transparent bg-gray-900 py-1 px-2 text-white rounded-md"
            >
              {currentStep === 'payment' ? 'Complete Investment' : 'Continue'}
              {currentStep !== 'payment' && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        )}

        </section>
    )
}

export default InvestNow;
