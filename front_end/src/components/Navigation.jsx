import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  PieChart,
  Wallet,
  User,
  Bell,
  Sprout,
  Users,
} from "lucide-react";
import { auth } from "../api/Api";

const Navigation = ({ onItemSelect }) => {

    const storedUser = auth.getUser()
    const role = storedUser?.role || 'investor'

    const navigationItems = useMemo(() => {
        if (role === 'farmer') {
            return [
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "opportunities", label: "Investors", icon: Users },
                { id: "market", label: "Market Trends", icon: TrendingUp },
                { id: "portfolio", label: "Farm Portfolio", icon: Sprout },
                { id: "wallet", label: "Wallet", icon: Wallet },
                { id: "profile", label: "Profile", icon: User }
            ]
        }

        return [
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "opportunities", label: "Opportunities", icon: Search },
            { id: "market", label: "Market Trends", icon: TrendingUp },
            { id: "portfolio", label: "Portfolio", icon: PieChart },
            { id: "wallet", label: "Wallet", icon: Wallet },
            { id: "profile", label: "Profile", icon: User }
        ]
    }, [role])


    

    return (
        <nav className="flex flex-col lg:flex-row justify-between items-center  p-4 " >
            <header 
                className="flex flex-row my-2"
                
            >
                
                <div className="p-2  rounded-lg bg-gray-900 text-white w-10 mr-2 hidden">
                    <LayoutDashboard className="h-6 w-6 " />
                </div>
                <div className="hidden">
                    <h1 className="text-lg lg:text-xl font-bold">Pasture Portfolio</h1>
                    <p className="text-[12px] -mt-2 lg:text-xs text-muted-foreground">Agricultural Investment Platform</p>
                </div>
         
        
            </header>
            {navigationItems.map(item => (
                
                
                <div key={item.id} className="" >
                    <NavLink to={`/${item.id}`} onClick={onItemSelect} className={({isActive}) => `p-2 rounded-lg flex flex-row items-center ${isActive? 'bg-gray-950 text-white' : ''}`}>
                        <item.icon className="h-4 w-4 mr-2"/>
                        <p className="text-sm font-bold ">{item.label}</p>
                        
                    </NavLink>
                </div>
            ))}
            <div>
                <Bell className="h-5 w-5"/>
            </div>
        </nav>
    )
}

export default Navigation;
