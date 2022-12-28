import React, { useEffect } from 'react'
// import axios from "axios"
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";


function LeftPanel({ liveUsers }) {

    // let getOnlineUsers =async()=>{
    //     let data =await JSON.stringify(liveUsers)
    //     console.log("data");
    //     console.log(data);
    //     data.length>0 && axios.get(`http://localhost:8080/api/user/getLiveUsers?liveusers[]=`+data)
    // }

    //    useEffect(() => {
    //     getOnlineUsers()
    //    }, [])



    return (
        <div className='bg-white p-3 rounded-lg shadow-light' >
            <h1 className='font-semibold text-gray-600'>Active Friends</h1>
            {liveUsers.length > 0 &&
                liveUsers?.map((item, index) => {
                    return (

                        <div className='flex my-3'>
                            <div>
                                <div className='rounded-full  relative w-[30px] h-[30px]'>
                                    <img src="../images/signUp.jpg" className='rounded-full objuct-cover w-full h-full ' alt="" />
                                    <div className='rounded-full animate-ping absolute bottom-0 right-0 p-1 bg-green-400'></div>
                                </div>
                            </div>


                            <div className='ml-2' key={index}>
                                <h2 className='text-[14px] font-semibold'>{item?.username}</h2>
                                <p className='text-[10px] text-gray-500'>Active</p>
                            </div>

                        </div>
                    )

                })
            }

        </div>
    )
}

export default LeftPanel