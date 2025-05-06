import React,{ useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import NotFound from './Pages/NotFound'
import Dashboard from './Pages/Dashboard'
import SidebarLayout from './Pages/SidebarLayout'
import Books from './Pages/Books'
import Users from './Pages/Users'
import Orders from './Pages/Orders'

const Logout = () => <div className="text-xl">Logging out...</div>;

function App() {

  return (
    <>
    <Routes>
      <Route path="/dashboard" element={<SidebarLayout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="books" element={<Books/>}/>
        <Route path="users" element={<Users/>}/>
        <Route path="orders" element={<Orders/>}/>
        <Route path="logout" element={<Logout/>}/>
      </Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    </>
  )
}

export default App
