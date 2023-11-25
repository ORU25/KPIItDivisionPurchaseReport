/* eslint-disable react/prop-types */
import Footer from "./Footer"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const Layout = ({children, title}) => {
    
  return (
    <div>
        <Navbar title={title}/>
        <Sidebar/>
        <main className="content-wrapper mt-3 bg-white min-vh-100 ">
            {children}
        </main>
        <Footer/>
    </div>
  )
}

export default Layout