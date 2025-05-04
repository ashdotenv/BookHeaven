import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import NotFound from './Pages/NotFound'
import { Toaster } from 'react-hot-toast'
import Home from './Pages/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster />
      <Footer />
    </>
  )
}

export default App
