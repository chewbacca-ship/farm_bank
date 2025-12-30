
import crop_img from '../assets/crops.jpg'
import livestock_img from '../assets/livestock.jpg'
import fishery_img from "../assets/fishery.jpg"
import equipments_img from "../assets/farmEquipments.jpg"
import { useNavigate } from 'react-router-dom'


const Invest = () => {

    const navigate = useNavigate()

    const handleCropSelection = () => {
        navigate('/crops')
    }

    const handleLivestockSelection = () => {
        navigate('/livestocks')
    }


    
       const crops = [
            { name: 'Wheat', symbol: 'WHET', icon: '🌾', },
            { name: 'Corn', symbol: 'CORN', icon: '🌽', price:55},
            { name: 'Rice', symbol: 'RICE', icon: '🍚', price: 55},
            { name: 'Cotton', symbol: 'COTN', icon: '🌿', price: 1234, },
            { name: 'Coffee', symbol: 'COFF', icon: '☕', price: 3456 },
            { name: 'Cocoa', symbol: 'COCO', icon: '🍫', price: 2789},
            { name: 'Palm Oil', symbol: 'PALM', icon: '🌴', price: 987},
            { name: 'Rubber', symbol: 'RUBR', icon: '🛞', price: 1876},
            { name: 'Tea', symbol: 'TEAS', icon: '🍃', price: 3234 },
            { name: 'Barley', symbol: 'BARL', icon: '🌾', price: 289},
            { name: 'Oranges', symbol: 'ORNG', icon: '🍊', price: 289},
            { name: 'Banana', symbol: 'BANA', icon: '🍌', price: 289},
            
            
          
            
        ];

       


    return (
        <section className=" pt-4 px-2 h-screen">
            <h2 className='font-bold  text-center text-lg'>INVEST IN</h2>
            <div className='flex flex-row justify-between items-center bg-green-950 rounded-lg px-4 py-7 my-4'>
                <div className='w-48 text-white'>
                    <h4 className='t font-bold'>Personalised investing</h4>
                    <p className=' text-sm my-2'>Set up your account to work for you</p>
                    <button className='bg-green-600  p-2 rounded-lg mt-4'>Get Started</button>

                </div>

                <img src={illustration} alt="" className='w-24 h-36'/>
                                    
            </div>

            <div className=' grid gap-4 grid-cols-2 mt-8'>
                <div className=' flex flex-col items-center'>

                    <button onClick={handleCropSelection}>
                        <img src={crop_img} alt="" className='w-36 h-36'/>

                    </button>
                    
                    
                    <h4 className='text-center'>Crops</h4>
                </div>

                <div className='flex flex-col items-center'>
                    <button onClick={handleLivestockSelection}>
                        <img src={livestock_img} alt="" className='w-36 h-36'/>

                    </button>
                    
                    <h4 className='text-center'>LiveStock</h4>

                </div>

                <div className='flex flex-col items-center'>
                    <button onClick={handleLivestockSelection}>
                        <img src={fishery_img} alt="" className='w-36 h-36'/>

                    </button>
                    
                    <h4 className='text-center'>Fishery</h4>

                </div>

                <div className='flex flex-col items-center'>
                    <button onClick={handleLivestockSelection}>
                        <img src={equipments_img} alt="" className='w-36 h-36'/>

                    </button>
                    
                    <h4 className='text-center'>Farm Equipments</h4>

                </div>
            </div>
            
            
           
            
            
        </section>

    )
}

export default Invest;