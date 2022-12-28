import { useEffect, useState } from 'react'
// import axios from 'axios'
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";

import useAxios from "axios-hooks";
import Popup from "./blockedPostspopup";

function PostBlock() {

    const [modal, setModal] = useState({status:false,id:''})

    const [data, setData]=useState({})
    const [render, setRender]=useState({})
   
   
    useEffect(() => {
        axios_two.get("post/getreportedPost").then((response)=>{
        console.log(response);
        setData(response)
    })
        console.log(data); 
    }, [render])
    
    function blockPost(userId) {
        console.log(userId);
        axios_two.get(`post/BlockAndUnblockPost?user=${userId}`)
        setRender(!render)
    }

    return (
        data.data &&
        <div>
            <div className=' bg-white pb-4 rounded-lg mt-4'>
                <div className='border-b-2 p-4 border-gray-100 '>
                    <p className='font-semibold text-xl'>User</p>
                </div>
                {
                    data.data.map((item, index) => {
                        return (
                            <div key={index} className='border-b-2  flex items-center justify-between p-4 border-gray-100 '>
                                <div className='flex items-center w-[15%]'>
                                    <div className='bg-gray-200 h-[40px] w-[40px] rounded-full'>
                                        <img src={`/images/post/${item.userId.profile}`} className='object-cover rounded-full w-full h-full ' alt="" />
                                    </div>
                                    <div className='ml-3'>
                                        <p>{item.userId.username}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-gray-500'>Reports : <span className='font-semibold'>{item.reports.length}</span></p>
                                </div>
                                <div>
                                    <p className=' text-blue-600 cursor-pointer'
                                        onClick={() => { setModal({status:true,id:item._id}) }}>Reported Users</p>
                                </div>
                                <div>
                                    <div className='h-[100px] w-[100px]'>
                                        <img src={`/images/post/${item.image}`} className='object-cover w-full h-full ' alt="" />
                                    </div>
                                </div>
                                <div>
                                    <button onClick={()=>{blockPost(item._id)}}
                                     className={`shadow  ${item.isBlock ?'bg-green-600 rounded-full hover:bg-green-700':'bg-red-600 rounded-full hover:bg-red-700'} focus:shadow-outline w-[140px] focus:outline-none text-white font-bold py-1 px-4`} type="submit">
                                        {item.isBlock ?'Unblock Post':'Block Post'}
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {
                modal &&
                <Popup id={modal.id}open={modal} onclose={() => { setModal({...modal,status:false}) }}/>
            }
        </div>
    )
}

export default PostBlock