const MarketOverview = () => {

    return(
        <section className="flex flex-col items-center">
            <div class=" w-48 bg-green-600 mb-4 bg-opacity-10 backdrop-blur-lg border border-agri-green border-opacity-20 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-agri-green hover:shadow-opacity-20 hover:border-agri-green hover:border-opacity-40">
                <h3 class="text-green-300 text-sm mb-2">Total Market Cap</h3>
                <div class="text-2xl font-bold text-agri-green" id="totalMarketCap">$847B</div>
            </div>
            <div class=" w-48 bg-green-600 mb-4 bg-opacity-10 backdrop-blur-lg border border-agri-green border-opacity-20 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-agri-green hover:shadow-opacity-20 hover:border-agri-green hover:border-opacity-40">
                <h3 class="text-green-300 text-sm mb-2">24h Volume</h3>
                <div class="text-2xl font-bold text-agri-green" id="totalVolume">$23.4B</div>
            </div>
            <div class=" w-48 bg-green-600 mb-4 bg-opacity-10 backdrop-blur-lg border border-agri-green border-opacity-20 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-agri-green hover:shadow-opacity-20 hover:border-agri-green hover:border-opacity-40">
                <h3 class="text-green-300 text-sm mb-2">Active Commodities</h3>
                <div class="text-2xl font-bold text-agri-green" id="activeFruits">15</div>
            </div>
        </section>
    )

}

export default MarketOverview