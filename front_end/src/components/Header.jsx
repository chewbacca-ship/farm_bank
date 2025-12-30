

const Header = () => {


   return (
     <header 
        className=" flex flex-row  items-center p-4 back backdrop-blur-md border-b border-[#2d5a2d] lg:hidden" 
        style={{background: "rgba(15, 30, 15, 0.95)"}}
    >
        <div className="text-4xl mr-2">🌾</div>

        <h1 
            className="  text-lg font-bold bg-gradient-to-r from-[#5ab34e] to-[#93C648] bg-clip-text text-transparent"
        >    
            AgriTrade-Cash Crop Exchange
        </h1>
        
    </header>
   )
}

export default Header
