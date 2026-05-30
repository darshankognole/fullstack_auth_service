import { Outlet } from 'react-router'
import Navbar from '../components/shared/Navbar'
import { Toaster } from 'react-hot-toast';

function RootLayout() {
  return (
    <div>
      <Toaster/>
      <Navbar/>
      <Outlet/>
    </div>
    
  )
}

export default RootLayout