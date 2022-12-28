import React, { useState, useEffect } from 'react'
// import axios from "axios";
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import { useNavigate } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
function Conversation({ conversation, currentUser}) {
   
    const [user, setUser] = useState(null)
    let navigate =useNavigate()

    useEffect(() => {

        var friendId = conversation?.members?.find((item) => item !== currentUser)
        const getUser = async () => {
            try {
                const res = await axiosInstance.get('user/getuserDetails?user=' + friendId)
                if (res.data.auth==false) {
                        navigate('/login')
                } else {
                    console.log("res");
                console.log(res);
                setUser(res.data)
                }

                
            } catch (error) {
                console.log(error);
            }
        }
        getUser()

    }, [conversation, currentUser])


    return (

        

                <div className='sm:flex items-center mt-3 hover:bg-gray-200 rounded-lg p-2'>
                    <div>
                        <div className='rounded-full  flex justify-center items-center h-[40px] w-[40px] overflow-hidden'>
                            { user?.profile ?
                                        <img src={`./images/post/${user.profile}`} className='objuct-cover w-full h-full ' alt="" />
                                   :<IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                                   }
                        </div>
                    </div>
                    
                            <div className='ml-2 '>
                                <h2 className='text-[13px] font-semibold'>{user?.username}</h2>
                            </div>
                      
                </div>

    )
}

export default Conversation