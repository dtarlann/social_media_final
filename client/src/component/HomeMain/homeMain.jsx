// import React from 'react'
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import Nav from "../nav/nav";

function HomeMail() {
  let navigate = useNavigate()
  useEffect(()=>{
    let user =localStorage.getItem('token')
    if(user){
      navigate('/home')
    }else{
      navigate('/login')
    }
  },[])
  return (
    <div>
         <div className=''>
            <Nav />
            <div className='bg-slate-100 '>
                <div className='  md:container mx-auto'>
                    <Outlet/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HomeMail