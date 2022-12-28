import React, { useState } from 'react'
import {IoArrowBackOutline} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import Countdown from 'react-countdown';
 
let BackgroundImage={
    // backgroundImage:url('./images/login-page.jpg')
    backgroundSize:'cover',
    backgroundPositionX:'-250px',
     backgroundPositionY:'-150px',
    backgroundImage: "url(./images/forgot-01.png)"
}

function ForgotPassword() {

    let navigate =useNavigate()
    let [email,setEmail]=useState('')
    let [emailErr,setEmailErr]=useState('')
    let [isOTP,SetIsOTP]=useState(false)
    let [popup,setPopup]=useState(false)
    let [otp,setOtp]=useState(new Array(4).fill(""))
    const [otpErr,SetOtpErr]=useState("")
    const [pw,setPw]=useState("")

    function onHandleSubmit(e){
        e.preventDefault()

        if(email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)){
            console.log("email");   
            console.log(email);
            axios_two.post(`user/forgotPassword?email=${email}`).then((response)=>{
            console.log(response);
            if(response.data.mail){
                setPopup(true)
            }else{
                setEmailErr("Enter proper email address")
            }
            })
        }else{
            console.log("error");
            setEmailErr("Enter proper email address")
        }
        
    }

    const handlechange =(element,index)=>{
        if(isNaN(element.value))return false;
        setOtp([...otp.map((dt,idx)=>(idx===index ? element.value :dt))]);

        if(element.nextSibling){
            element.nextSibling.focus()
        }
    }

    let onOTPSubmit=(e)=>{
        e.preventDefault()
        console.log('otp');
        console.log(otp);
        console.log(pw);
        let userOtp =[...otp]
        console.log(userOtp);
        // otp ={...otp.map(item=>"")}
        console.log(userOtp);
        if(pw.password === pw.confirmpassword){
        let data={
            otp:userOtp,
            password:pw.password
        }
        
        if(userOtp[0]=="" ||userOtp[1]=="" ||userOtp[2]=="" ||userOtp[3]==""){
            SetOtpErr("Enter Valid OTP")
        }else{
            console.log("yooo yeee");
            axios_two.post('user/verifyForgotPWOTP',data).then((response)=>{
            if(response.data.user){
                 navigate('/login')
            }else{
                SetOtpErr(response.data.message)
            }
            })
        }
    }else{
        SetOtpErr("Enter proper password")
    }
    }

    return (
        <div className='min-h-screen flex-col flex justify-center items-center bg-slate-100' style={BackgroundImage}>
            <div className='container mx-auto flex  justify-end'>
            <div className='rounded-xl flex flex-col justify-center text-center shadow-light p-6 bg-[#ffffffad] min-h-[50vh] w-[50%]'>
                <p className='font-semibold text-lg'>Forgot Password ?</p>
                <p className='text-gray-500'>No Worries, we'll send you reset instruction</p>
                <div className="mb-3 text-left">
                            <div className='mb-1'>
                                <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                  Email
                                </label>

                            </div>

                            <div>
                                <input  className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                                placeholder='Email'
                                type='email'
                                required
                                value={email} 
                                onChange={(e)=>{setEmail(e.target.value)}}/>
                            </div>
                        </div>
                        <div className='text-center'>
                <button className="shadow  w-[80%] bg-blue-500 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
                type="submit"
                onClick={(e)=>onHandleSubmit(e)}>
                    Reset Password
                </button>

                <p className='mt-3 text-red-500'>{emailErr}</p>
                </div>

                <p className='text-gray-500 text-light flex justify-center items-center text-sm mt-3 cursor-pointer' onClick={()=>{navigate('/login')}}><IoArrowBackOutline/><span>Back To Login</span> </p>
            </div>
        </div>


        {popup ?
            <div className=' absolute left-0 right-0 top-0 bottom-0 bg-[#22222282]'>
            <div className='shadow-light rounded-lg bg-white p-6 sm:w-[70%] md:w-[45%] top-0 left-0 right-0 sm:top-[10%] sm:left-[20%] sm:right-[20%] ss:top-[5%] ss:left-[10%] ss:right-[10%] md:top-[10%] md:left-[30%] md:right-[30%] text-center absolute'>
            <div className='text-right cursor-pointer' onClick={()=>{setPopup(false)}}>x</div>
            <h2 className='font-semibold text-gray-500'>Please enter the OTP password to verify your account </h2>
            <p className='text-gray-500 text-sm mt-3' >OTP has been sent to  {email}</p>
            {
                otp.map((data,index)=>{
                    return(
                    <input className='border rounded mt-6 text-center w-[40px] mr-4'
                     type="text" 
                     name='otp'
                     maxLength='1'
                     key={index}
                     value={data}
                     onChange={(e)=>{handlechange(e.target,index)}}
                     onFocus={e=>e.target.select()}/>
                    )
                }) 
            }
            <div className='text-red-500 font-[12px] mt-4'>
            <Countdown date={Date.now() + 300000} />
            </div>
            <div className='mt-4'>
                <div>
                <div className="mb-3 text-left">
                            <div className='mb-1'>
                                <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                    New Password
                                </label>

                            </div>

                            <div>
                                <input  className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                                id="inline-full-name" 
                                placeholder='Password' 
                                type="password"
                                value={pw.password}
                                onChange={(e)=>{setPw({...pw,password:e.target.value})}}
                                />
                            </div>
                        </div>
                        <div className="mb-3 text-left">
                            <div className='mb-1'>
                                <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                    Confirm New Password
                                </label>

                            </div>

                            <div>
                                <input  className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                                id="inline-full-name" 
                                placeholder='Password' 
                                type="password"
                                value={otp.password}
                                onChange={(e)=>{setPw({...pw,confirmpassword:e.target.value})}}
                                />
                            </div>
                        </div>
                </div>
            <button className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4' 
            onClick={(e)=>setOtp([...otp.map(()=>"")])}>Clear</button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={(e)=>{onOTPSubmit(e)}}>Submit</button>

            <p className='text-red-500 mt-4'>{otpErr}</p>
            </div>
            </div>
            </div>
            :null}
        </div>
    )
}

export default ForgotPassword