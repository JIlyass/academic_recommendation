import { Routes , Route } from "react-router-dom"
import  Navbar  from "./components/Navbar"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import { FeaturesSection } from "./components/FeaturesSection"
import Predict from "./components/Predict"
import AuthPage from "./components/AuthPage"
export default function App(){
  return (<>
    <Navbar/>
      <Routes>
         <Route path='/' element ={ <HeroSection/> } /> 
         <Route path='/feautures' element ={ <FeaturesSection/> } /> 
         <Route path='/predict' element ={ <Predict/> } /> 
         <Route path='/AuthPage' element ={ <AuthPage/> } /> 
       </Routes>
    <Footer />

  </>  )
}