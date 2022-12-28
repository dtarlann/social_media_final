import React, { useState, useEffect } from 'react'
// import { json } from 'react-router-dom';
import { axiosInstance, axios_two } from "../../axiosInstance/axiosInstance";

const style = {
    position: 'fixed',
    top: '20vh',
    left: '35%',
    right: '35%',
    height: '60vh',
    transform: 'transilate(-50%,-50%)',
    // backgroundColor:'#fff',
    // padding:'30px 20px',
    zIndex: 1000,
}

const overLay = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    zIndex: 1000,
    borderRadious: '10px'
}


function FollowList({ props, onclose, value }) {

    console.log("user view folow");
    console.log(value);
    const [data, setData] = useState({})

    // useEffect(() => {

    //     axios_two.get(`user/getFollowers?users=${value}`).then((response)=>{
    //     console.log(response);
    //     setData(response.data)
    //     }) 

    // }, [value]);


    return (
        <div>
            <div style={overLay} />
            <div className='rounded' style={style}>
                <div className='bg-white max-h-[350px] overflow-auto px-3 py-6 rounded-lg'>
                    <p className='cursor-pointer absolute top-[10px] right-[10px]' onClick={onclose}>X</p>
                    <div className='max-h-full  overflow-auto'>
                        <p className='font-semibold text-xl text-center'>{props}</p>

                        {
                            value.length &&
                            value?.map((item, index) => {
                                return (
                                    <div className='flex items-center mt-3'>
                                        <div className='bg-gray-200 h-[40px] w-[40px] rounded-full'>
                                            <img src={`/images/post/${item.profile}`} className='object-cover rounded-full w-full h-full ' alt="" />
                                        </div>
                                        <div className='ml-3'>
                                            <p>{item?.username}</p>
                                        </div>
                                    </div>
                                )

                            })
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FollowList