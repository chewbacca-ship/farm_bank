import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useNavigate, Outlet } from 'react-router-dom'
import {Toaster, toast } from "sonner"
import Navigation from './components/Navigation'
import Profile from './components/Profile'
import Invest from './components/Invest'
import { auth } from './api/Api'
import { useEffect } from 'react'
import Wallet from './components/Wallet'
import Portfolio from './components/Portfolio'
import DashboardSelector, { PortfolioSelector, OpportunitiesSelector } from './components/DashboardSelector'
import StartPage from './components/StartPage'
import MarketTrends from './components/MarketTrends'
import Header from './components/Header'
import Footer from './components/Footer'

const queryClient = new QueryClient()

const ProtectedLayout = () => {
  const navigate = useNavigate()
  const isAuthenticated = auth.isAuthenticated()

  useEffect(() => {
    if (!isAuthenticated) navigate('/startpage')
  }, [isAuthenticated, navigate])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

 function App() {
  return (
    <>
    
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="lg:flex lg:flex-col justify-end w-screen overflow-auto">
          <Routes>
            <Route path="/startpage" element={<StartPage/>} />

            <Route element={<ProtectedLayout/>}>
              <Route index element={<DashboardSelector />} />
              <Route path="dashboard" element={<DashboardSelector />} />
              <Route path="invest" element={<Invest />} />
              <Route path="profile" element={<Profile />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="portfolio" element={<PortfolioSelector />} />
              <Route path="opportunities" element={<OpportunitiesSelector />} />
              <Route path="market" element={<MarketTrends />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
    <Toaster richColors position='bottom-right'/>

    </>
  )
}

export default App
