import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import "../../App.css"
// import Axios from "axios";
import {axios_two} from "../../axiosInstance/axiosInstance";




function AdminLogin() {

    let Navigate = useNavigate()
useEffect(() => {
    let adminToken = localStorage.getItem("adminToken")
    if(adminToken){
        Navigate('/admin')
    }
  
}, [])

    let [data,setData]=useState({})
    let[err,setErr]=useState()

   let handleSubmit = ((event)=>{
    event.preventDefault()
    console.log("data");
    console.log(data);
    axios_two.post('admin/login',{
        email:data.email,
        password:data.password
    }).then((response)=>{
        console.log(response);
        if(response.data.user){
            let token =response.data.token
            localStorage.setItem("adminToken",token)
            Navigate('/admin')
        }else{
            console.log("!user");
            setErr(response.data.message)
        }
    })
    })

    return (
        <div className='px-52 min-h-screen flex-col flex justify-center bg-slate-50 '>
            <div class="grid grid-cols-2 max-h-[70vh] rounded-xl relative shadow-light">
                <div>
                    <img src="../images/adminLogin.png" className='rounded-l-xl max-h-[70vh] object-cover w-full' alt="" />
                </div>
                <div className='bg-white p-8 flex flex-col justify-center text-center max-h-[70vh] right-0 w-[55%] h-full rounded-xl absolute'>
                    <h1 className='text-2xl font-bold'>Welcome Back</h1>
                    <p className='text-sm mb-4 text-slate-500'>Welcome back ! Please enter your details</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-left">
                            <div className='mb-1'>
                                <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                    Email
                                </label>

                            </div>

                            <div>
                                <input className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                 id="inline-full-name"
                                  placeholder='Email' 
                                  type="email" 
                                  value={data.email}
                                  onChange={(e)=>setData({...data,email:e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 text-left">
                            <div className='mb-1'>
                                <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                    Password
                                </label>

                            </div>

                            <div>
                                <input type="password" className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                                id="inline-full-name" 
                                placeholder='Password'
                                value={data.password}
                                onChange={(e)=>setData({...data,password:e.target.value})}/>
                            </div>
                        </div>
                        <p className='text-right mb-5 text-sm'><a href=""> Forgot Password ?</a></p>
                        <div className="text-cnter">
                            <button className="shadow  w-[80%] bg-blue-500 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                Login
                            </button>
                        </div>
                        <p className='mt-4 text-slate-500'>Don't have an account ? <span className='text-blue-800 cursor-pointer font-semibold'><a onClick={(e) => { e.preventDefault(); Navigate('/admin/register') }}> Sign up for free </a></span></p>
                        <p className='text-red-500 mt-3'>{err}</p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin