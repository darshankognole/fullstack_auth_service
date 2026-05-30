import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Routes, Route} from "react-router"
import RootLayout from './Pages/RootLayout.tsx'
import App from './App.tsx'
import Login from './Pages/Login.tsx'
import About from './Pages/About.tsx'
import Signup from './Pages/Signup.tsx'
import Services from './Pages/Services.tsx'
import UserLayout from './Pages/Users/UserLayout'
import Userhome from './Pages/Users/Userhome.tsx'
import UserProfile from './Pages/Users/UserProfile.tsx'
import OAuthSuccess from './Pages/OAuthSuccess.tsx'
import OAuthFailure from './Pages/OAuthFailure.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<RootLayout/>}>
        <Route index element={<App/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/services' element={<Services/>}/>
        <Route path='/dashboard' element={<UserLayout/>}>
          <Route index element={<Userhome/>}></Route>
          <Route path='profile' element={<UserProfile/>}></Route>
        </Route>
        <Route path='oauth/success' element={<OAuthSuccess/>}></Route>
        <Route path='oauth/failure' element={<OAuthFailure/>}></Route>
      </Route>
    </Routes>
  </BrowserRouter>,
)
