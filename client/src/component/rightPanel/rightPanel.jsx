import React, { useEffect, useRef, useState } from 'react'
import { IoPersonCircleOutline, } from "react-icons/io5";
import { axiosInstance, axios_two } from "../../axiosInstance/axiosInstance";
import {useNavigate,Link}from "react-router-dom";

function RightPanel(props) {

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [render, setrender] = useState(false)
    const [suggetion, setData] = useState([])

    console.log("props");
    console.log(props);
    console.log(props.value.user.profile);
    let userId = localStorage.getItem('user')

    useEffect(() => {
        console.log("fetch data from userprofile");
        try {
            setLoading(true)
            setError(false)
            axiosInstance.get(`user/getAllUsers?user=${userId}`).then((response) => {
                console.log("response.data right pannel");
                console.log(response.data);
                setData(response.data)
            })
        }
        catch (error) {
            setError(true)
        }

        setLoading(false)

    }, [render])


    if (loading) return (<div className='h-[90vh] flex justify-center items-center'>Loading...</div>)

    if (error) return 'An error has occurred: ' + error.message

    return (
        <div className='bg-white p-3 rounded-lg shadow-light'>

            <div className='flex my-3'>
                <div>
                    <div className='rounded-full flex justify-center items-center h-[50px] w-[50px] bg-gray-300 overflow-hidden'>
                        {props.value.user.profile !== "null" ?
                            <img src={`./images/post/${props.value.user.profile}`} className='object-cover rounded-full w-full h-full ' alt="" />
                            : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                        }
                    </div>
                </div>
                <div className='ml-2'>
                    <h2 className='text-[16px] font-semibold'>{props.value.user.first_name}</h2>
                    <p className='text-[12px] text-gray-500'>{props.value.user.username}</p>
                </div>
            </div>

            <h1 className='font-semibold text-gray-600'>Suggestion For You</h1>

            {

                suggetion.map((item, index) => {

                    return (

                        <div className='flex my-3 justify-between items-center'>
                            <div className='flex '>
                                <div className='rounded-full overflow-hidden relative w-[30px] h-[30px]'>
                                {item.profile !== "null" ?
                            <img src={`./images/post/${item.profile}`} className='object-cover rounded-full w-full h-full ' alt="" />
                            : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                        }
                                </div>

                                <div className='ml-2'>
                                <Link  className='font-semibold' key={index}
                                  to={"/userProfile"} state={{ user: item._id}}>{item.first_name}</Link>
                                    <p className='text-[10px] text-gray-500'>{item.username}</p>
                                </div>
                            </div>
                            {/* <div className='ml-2'>
                                <h2 className='text-[14px] font-semibold  text-blue-600 float-right cursor-pointer'>Follow</h2>
                            </div> */}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default RightPanel