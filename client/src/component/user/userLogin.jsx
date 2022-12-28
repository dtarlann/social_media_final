import '../../App.css';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
// import Axios from "axios";
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";



function UserLogin() {
  
    let Navigate = useNavigate()
    let [userData,setUserData]=useState({})
    let [err,setErr]=useState('')
    // setUserData("")

    function submitHandle(e) {
        
        e.preventDefault()
        let data={
            email:userData.email,
            password:userData.password
        }
        axios_two.post('auth/login',data).then((response)=>{
            console.log("response");
            console.log(response);
            if (response.data.auth) {
                localStorage.setItem("token",response.data.token)
                localStorage.setItem("user",response.data.userId)
                Navigate('/')
            }else{
                console.log(response.message);
                setErr(response.data.message)
                console.log("gh");
                // Navigate('/login')
            }
        })
    }

    

    return (
        <div>
        
       
        <div  className='ss:px-0 sm:px-20 md:px-52 min-h-screen flex-col flex sm:justify-center bg-slate-50 '>
            
            <div class="ss:grid sm:grid-cols-2 ss:max-h-[70vh] rounded-xl relative shadow-light">
                <div className=' sm:max-h-[70vh]'>
                    <img src="./images/login-page.jpg" className='rounded-l-xl h-full w-full  object-cover' alt="" />
                </div>
                <div className='bg-white p-8 flex flex-col justify-center text-center md:max-h-[70vh] right-0 w-full sm:w-[55%] h-full rounded-xl sm:absolute'>
                    <h1 className='text-2xl font-bold'>Welcome Back</h1>
                    <p className='text-sm mb-4 text-slate-500'>Welcome back ! Please enter your details</p>
                    <form onSubmit={submitHandle}>
                        <div className="mb-3 text-left">
                            <div className='mb-1'>
                                <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                    Email
                                </label>

                            </div>

                            <div>
                                <input  className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                                id="inline-full-name"
                                 placeholder='Email' 
                                 type="email"
                                 value={userData.email}
                                 onChange={(e)=>{setUserData({...userData,email:e.target.value})}}/>
                            </div>
                        </div>
                        <div className="mb-3 text-left">
                            <div className='mb-1'>
                                <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                    Password
                                </label>

                            </div>

                            <div>
                                <input  className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                                id="inline-full-name" 
                                placeholder='Password' 
                                type="password"
                                value={userData.password}
                                onChange={(e)=>{setUserData({...userData,password:e.target.value})}}/>
                            </div>
                        </div>
                        <p className='text-right mb-5 text-sm cursor-pointer' onClick={()=>{Navigate('/forgotPassword')}}> Forgot Password ?</p>
                        <div className="text-cnter">
                            <button className="shadow  w-[80%] bg-[#af6480] hover:bg-[#4b5a7b] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                Login
                            </button>
                        </div>
                        <p className='text-red-500 mt-3'>{err}</p>
                        <p className='mt-4 text-slate-500'>Don't have an account ? <span className='text-blue-800 cursor-pointer font-semibold'><a onClick={(e) => { e.preventDefault(); Navigate('/signup') }}> Sign up for free </a></span></p>
                    </form>
                </div>
            </div>
        </div>
        </div>
    )
}

export default UserLogin