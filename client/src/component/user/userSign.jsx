import { useState } from 'react'
import { useNavigate, } from "react-router-dom";
// import axios from 'axios'
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import { useForm } from 'react-hook-form'
import Countdown from 'react-countdown';
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

function UserSignup() {

    let navigate = useNavigate()

    let [popup, setPopup] = useState(false)
    let [otp, setOtp] = useState(new Array(4).fill(""))
    const [passwordErr, SetpasswordErr] = useState("")
    const [otpErr, SetOtpErr] = useState("")
    const [user, setUser] = useState("")
    const [loader, setLoader] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm();

    console.log("errors");
    console.log(errors);
    let email
    let onSubmit = (userData) => {
        console.log(userData);
        
        setOtp(Array(4).fill(""))
        SetOtpErr("")
        if (userData.password != userData.confirm_password && errors) {
            SetpasswordErr("Enter valid credentials")
        } else {
            setLoader(true)
            let data = {
                first_name: userData.first_name,
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
            }
            email = data.email
            axios_two.post('user/signup', data).then((response) => {
                console.log(response);
                if (response.data.mail) {
                    setUser(response.data.user)
                    setLoader(false)
                    setPopup(true)
                } else {
                    SetpasswordErr(response.data.message)
                }
            })
        }
    }



    const handlechange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((dt, idx) => (idx === index ? element.value : dt))]);

        if (element.nextSibling) {
            element.nextSibling.focus()
        }
    }

    let onOTPSubmit = (e) => {
        e.preventDefault()
        console.log('otp');
        console.log(otp);
        let userOtp = [...otp]
        console.log(userOtp);
        // otp ={...otp.map(item=>"")}
        console.log("sdfghjk");
        console.log(userOtp);
        let data = {
            userOtp,
            user: user
        }

        if (userOtp[0] == "" || userOtp[1] == "" || userOtp[2] == "" || userOtp[3] == "") {
            SetOtpErr("Enter Valid OTP")
        } else {
            console.log("yooo yeee");
            axios_two.post('user/verifyOTP', data).then((response) => {
                if (response.data.user) {
                    notify()
                    setPopup(false)
                    setTimeout(() => {  
                        navigate('/login')
                    }, 1000);
                } else {
                    SetOtpErr(response.data.message)
                }
            })
        }
    }

    let notify=()=>{
        Store.addNotification({
            title: "Wonderful!",
            message: "Account Created successfully",
            type: "success",
            insert: "",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: true
            }
          });
    }

    return (
        <div>
                <ReactNotifications />
       
        <div className={`ss:px-0 sm:px-20 ${loader&& "pointer-events-none"} md:px-52 min-h-screen flex-col flex sm:justify-center bg-slate-50`}>
            <div class="sm:grid sm:grid-cols-2 ss:max-h-[70vh] rounded-xl relative shadow-light">
                <div className=' sm:max-h-[70vh]'>
                    <img src="./images/signUp.jpg" className='rounded-l-xl h-full w-full  object-cover' alt="" />
                </div>
                <div className='bg-white p-8 flex flex-col justify-center text-center md:max-h-[70vh] right-0 w-full sm:w-[55%] h-full rounded-xl sm:absolute'>
                    <h1 className='text-2xl font-bold'>Welcome Back</h1>
                    <p className='text-sm mb-4 text-slate-500'>Welcome back ! Please enter your details</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='ss:grid grid-cols-2 gap-4'>
                            <div>
                                <div className="mb-3 text-left">
                                    <div className='mb-1'>
                                        <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                            Full Name
                                        </label>

                                    </div>

                                    <div>
                                        <input className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="inline-full-name"
                                            placeholder='First Name'
                                            {...register("first_name", {
                                                required: "required",
                                                pattern: {
                                                    value: /^[A-Z]\w\D*$/i,
                                                    message: "Enter proper name"
                                                }
                                            })} />
                                        <p className='text-red-500 font-[8px]'>{errors.first_name?.message}</p>
                                    </div>
                                </div>
                                <div className="mb-3 text-left">
                                    <div className='mb-1'>
                                        <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                            Email
                                        </label>

                                    </div>

                                    <div>
                                        <input type="email" className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="inline-full-name"
                                            placeholder='Email'
                                            {...register("email", {
                                                required: "required",
                                                pattern: {
                                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                                    message: "Enter proper email address"
                                                }
                                            })} />
                                        <p className='text-red-500 font-[8px]'>{errors.email?.message}</p>
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
                                            {...register("password", {
                                                required: "required",
                                                pattern: {
                                                    value: /^(?=.*[a-zA-Z]).{8,}$/,
                                                    message: "Must contain 8 characters"
                                                }
                                            })} />
                                        <p className='text-red-500 font-[8px]'>{errors.password?.message}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="mb-3 text-left">
                                    <div className='mb-1'>
                                        <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                            User Name
                                        </label>

                                    </div>

                                    <div>
                                        <input className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="inline-full-name"
                                            placeholder=' Last Name'
                                            {...register("username", { required: "required" })} />
                                        <p className='text-red-500 font-[8px]'>{errors.last_name?.message}</p>
                                    </div>
                                </div>
                                <div className="mb-3 text-left">
                                    <div className='mb-1'>
                                        <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                            Phone Number
                                        </label>

                                    </div>

                                    <div>
                                        <input className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="inline-full-name"
                                            placeholder='Phone Number'
                                            type='tel'
                                            {...register("phone", {
                                                required: "required",
                                                pattern: {
                                                    value: /^[789]\d{9}$/i,
                                                    message: "Enter proper phone number"
                                                }
                                            })} />
                                        <p className='text-red-500 font-[8px]'>{errors.phone?.message}</p>
                                    </div>
                                </div>
                                <div className="mb-3 text-left">
                                    <div className='mb-1'>
                                        <label className="block text-sm text-gray-500 font-semibold  md:mb-0 pr-4"  >
                                            Confirm Password
                                        </label>

                                    </div>

                                    <div>
                                        <input type="password" className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="inline-full-name"
                                            placeholder='Confirm Password'
                                            {...register("confirm_password", {
                                                required: "required",
                                                pattern: {
                                                    value: /^(?=.*[a-zA-Z]).{8,}$/,
                                                    message: "Must contain 8 characters"
                                                }
                                            })} />
                                    </div>
                                    <p className='text-red-500 font-[8px]'>{errors.first_name?.message}</p>
                                    <p className='text-red-500 font-[8px]'>{passwordErr}</p>
                                </div>
                            </div>

                        </div>

                        <div className="text-cnter mt-4">
                            <button className="shadow  w-[80%] bg-blue-500 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                Create Account
                            </button>
                        </div>
                        <p className='mt-4 text-slate-500'>Already have an account ? <span className='text-blue-800 cursor-pointer font-semibold'><a onClick={(e) => { e.preventDefault(); navigate('/login') }}> Login </a></span></p>
                    </form>
                </div>
            </div>
            {popup ?
                <div className=' absolute left-0 right-0 top-0 bottom-0 bg-[#22222282]'>
                    <div className='shadow-light rounded-lg bg-white p-6 sm:w-[70%] md:w-[45%] top-0 left-0 right-0 sm:top-[30%] sm:left-[20%] sm:right-[20%] ss:top-[10%] ss:left-[10%] ss:right-[10%] md:top-[33%] md:left-[30%] md:right-[30%] text-center absolute'>
                        <div className='text-right cursor-pointer' onClick={() => { setPopup(false) }}>x</div>
                        <h2 className='font-semibold text-gray-500'>Please enter the OTP password to verify your account </h2>
                        <p className='text-gray-500 text-sm mt-3' >OTP has been sent to  {register.email}</p>
                        {
                            otp.map((data, index) => {
                                return (
                                    <input className='border rounded mt-6 text-center w-[40px] mr-4'
                                        type="text"
                                        name='otp'
                                        maxLength='1'
                                        key={index}
                                        value={data}
                                        onChange={(e) => { handlechange(e.target, index) }}
                                        onFocus={e => e.target.select()} />
                                )
                            })
                        }
                        <div className='text-red-500 font-[12px] mt-4'>
                            <Countdown date={Date.now() + 100000} />
                        </div>
                        <div className='mt-4'>
                            <button className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4'
                                onClick={(e) => setOtp([...otp.map(() => "")])}>Clear</button>
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                onClick={(e) => { onOTPSubmit(e) }}>Submit</button>

                            <p className='text-red-500 mt-4'>{otpErr}</p>
                        </div>
                    </div>
                </div>
                : null}

            {loader ?
                <div className='absolute left-[50%] top-[40%] '>
                     
  <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100">
    <path d="M 50,50 L 33,60.5 a 20 20 -210 1 1 34,0 z" fill="#000">
      <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.2s" repeatCount="indefinite"/>
    </path>
      <circle cx="50" cy="50" r="16" fill="#fff"></circle>
    </svg>

                </div>:null

            }


        </div>
        </div>
    )
}

export default UserSignup