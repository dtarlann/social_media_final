import React, { useEffect, useState, useRef,useContext } from 'react'
import { io } from 'socket.io-client'
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
// import axios from 'axios'
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import { useNavigate } from "react-router-dom";
import { IoPersonCircleOutline, IoCameraOutline, IoEllipsisVerticalSharp } from "react-icons/io5";
import {NotificationCountContext} from "../../contex/appContext";

function Notification() {

    const [notification, setNotification] = useState([])
    const [notificationCount, setNotificationCount] =useContext(NotificationCountContext)

    const socket = useRef()
    const queryClient = useQueryClient()
    let navigate = useNavigate()

    let userId = localStorage.getItem('user')

    useEffect(() => {
        return () => {
            axiosInstance.get(`user/readNotification?user=${userId}`)
            setNotificationCount(0)
        };
    }, []);


    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['notification'],
        queryFn: () =>
        axiosInstance.get(`user/getNotification?user=${userId}`)
    })
    console.log("data");
    { data && console.log(data); }


//    useEffect(() => {
//     chckNotification()
//    }, [])

//    data?.data && (function chckNotification(){
//     if(data?.data?.length > 1){
//         axiosInstance.get(`user/removeNotification?user=${userId}`)
//     }
//    })()
   
    
   

    if (error) return 'An error has occurred: ' + error.message

    if (data?.data?.auth == false)
        return <div className='fixed top-0 left-0 bg-gray-100 right-0 bottom-0 text-center '><div className='z-20 absolute left-0 right-0 top-[40%]'>{`An error has occurred: ${data.data.message}`}<br></br><button className='bg-gray-800 mt-3 hover:bg-black text-sm text-white font-bold py-1 px-2 rounded' onClick={() => { navigate('/login') }}>Go to Login</button></div></div>

    // useEffect(() => {
    //     socket.current = io("ws://localhost:8900");
    // }, [])


    return (
        <div className='shadow-light bg-gray-50 p-4 w-[25%]  max-h-[50vh]   overflow-auto rounded-lg absolute right-[20%] z-30  h-max-[200px] top-[4.5rem]'>
            <div>
                {isLoading && <div >Loading...</div>}
                <p>{notification?.data}</p>
                <p className='font-semibold mb-3'>Notifications</p>
                {
                    data?.data.length < 1 && <p className='text-center text-gray-400 py-5'>You have 0 notifications</p>
                }
                {
                    data?.data.length > 0    &&
                    data.data.map((item, index) => {
                        return (
                            item.type === 'like' ?
                                <div className='flex items-center justify-between py-1'>
                                    <div className='flex'>
                                        <div className='w-[30px] h-[30px]'>
                                            {
                                                item.userProfil === "null" ?
                                                    <IoPersonCircleOutline className='w-full  text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                                    : item.userProfil != null ?

                                                        <img className='w-full h-full object-cover  rounded-full' src={`./images/post/${item.userProfil}`} alt="User Profile " />

                                                        : <IoPersonCircleOutline className='w-full text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                            }
                                        </div>
                                        <div className='ml-3'>
                                            <p>{item.username} {item.type} your post</p>
                                        </div>
                                    </div>
                                        <div className='h-[40px] w-[40px]'>
                                            <img className='w-full h-full object-cover rounded-lg ml-2' src={`./images/post/${item.post}`} alt="User Profile " />
                                        </div>

                                </div>
                                : item.type === 'comment' ?
                                    <div className='flex items-center justify-between py-1'>
                                        <div className='flex'>
                                        <div className='w-[30px] h-[30px]'>
                                            { 
                                                item.userProfil === "null" ?
                                                    <IoPersonCircleOutline className='w-full  text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                                    : item.userProfil != null ?

                                                        <img className='w-full h-full object-cover rounded-full' src={`./images/post/${item.userProfil}`} alt="User Profile " />

                                                        : <IoPersonCircleOutline className='w-full text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                            }
                                        </div>
                                        <div className='ml-3'>
                                            <p>{item.username} {item.type}ed on your post</p>
                                        </div>
                                        </div>
                                        <div className='h-[40px] w-[40px]'>
                                            <img className='w-full h-full object-cover rounded-lg ml-2' src={`./images/post/${item.post}`} alt="User Profile " />
                                        </div>
                                    </div>
                                    :
                                    <div className='flex py-2 items-center'>
                                        <div className='w-[30px] h-[30px]'>
                                            {
                                                item.userProfil === "null" ?
                                                    <IoPersonCircleOutline className='w-full  text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                                    : item.userProfil != null ?

                                                        <img className='w-full h-full object-cover rounded-full' src={`./images/post/${item.userProfil}`} alt="User Profile " />

                                                        : <IoPersonCircleOutline className='w-full text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                            }
                                        </div>
                                        <div className='ml-3'>
                                            <p>{item.username} started {item.type}ing you</p>
                                        </div>

                                    </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Notification