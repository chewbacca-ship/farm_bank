import { useState } from "react";
import { Users, Wheat } from 'lucide-react';
import Signup from '../components/Signup'
import SignIn from "../components/SignIn";

const StartPage = () => {

    const [selectedRole, setSelectedRole] = useState(null);
    const [authMode, setAuthMode] = useState('login');
    const [signIn, setSignIn] = useState(true)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        // Investor specific
        investmentRange: '',
        investmentExperience: '',
        // Farmer specific
        farmSize: '',
        primaryCrops: '',
        farmLocation: '',
        farmingExperience: '',
        projectDescription: '',
        // Common
        agreeToTerms: false,
        agreeToMarketing: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

 
    if (!selectedRole) {return ( 
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">AgriInvest</h1>
            <p className="text-gray-600">Choose your role to get started</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border rounded-lg "
              onClick={() => setSelectedRole('investor')}
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">I'm an Investor</h3>
                  <p className="text-sm text-gray-600">
                    I want to invest in agricultural projects and earn returns
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border rounded-lg bg-white"
              onClick={() => setSelectedRole('farmer')}
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Wheat className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">I'm a Farmer</h3>
                  <p className="text-sm text-gray-600">
                    I want to raise funding for my agricultural projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
      
    )}

    return (
        <section className="flex flex-col items-center ">
            <button
              
              onClick={() => setSelectedRole(null)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to role selection
            </button>

            <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              {selectedRole === 'investor' ? (
                <Users className="w-6 h-6 text-blue-600" />
              ) : (
                <Wheat className="w-6 h-6 text-green-600" />
              )}
              <h1 className="text-2xl font-bold">
                {selectedRole === 'investor' ? 'Investor Portal' : 'Farmer Portal'}
              </h1>
            </div>
            <p className="text-gray-600">
              {selectedRole === 'investor' 
                ? 'Access your investment dashboard' 
                : 'Manage your agricultural projects'
              }
            </p>
          </div>
              <article className="bg-white  border-2 w-96 p-4">
                <div className="w-full flex flex-row items-center justify-between bg-gray-300 p-2 rounded-2xl ">

                    <button 
                      className={`${signIn? "bg-gray-50 rounded-2xl" : ""} w-1/2`}
                      onClick={() => setSignIn(!signIn)}
                    >Sign In</button>
                    <button 
                      className={`${!signIn ? "bg-gray-50 rounded-2xl" : ""} w-1/2 p-1 `}
                      onClick={() => setSignIn(!signIn)}
                    >Sign Up</button>
                </div>

                {signIn && <SignIn selectedRole={selectedRole}/>}
                {!signIn && <Signup selectedRole={selectedRole}/>}

                
              </article>
        </section>
    )
    
}

export default StartPage;