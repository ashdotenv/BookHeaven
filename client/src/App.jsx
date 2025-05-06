import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import NotFound from './Pages/NotFound'
import { Toaster } from 'react-hot-toast'
import Home from './Pages/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import SingleProduct from "./Pages/SingleProduct";
import Cart from './Pages/Cart';
import Order from './Pages/Order';
import MyOrders from './Pages/MyOrders';
import Banner from "./Components/Banner";

function App() {

  return (
    <>
      <Banner />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/product/:id' element={<SingleProduct />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<Order />} />
        <Route path='/orders' element={<MyOrders />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster />
      <Footer />
    </>
  )
}

export default App
