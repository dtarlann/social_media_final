import { useEffect, useState } from 'react'
// import axios from 'axios'
import {axios_two} from "../../axiosInstance/axiosInstance";
import useAxios from "axios-hooks";
import Popup from "./blockedUserspopup";

function UserBlock() {

    const [modal, setModal] = useState({id:'',status:false})
    const [data, setData]=useState({})
    const [render, setRender]=useState({})
    // const [{ data, loading, error }, refetch] = useAxios("http://localhost:8080/api/user/getAlluser");
    // console.log(data);
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error!</p>;
   
    useEffect(() => {
        axios_two.get("user/getAlluser").then((response)=>{
        console.log(response.data);
        setData(response.data)
    })
        console.log(data); 
    }, [render])
    


    function blockUser(userId) {
        console.log(userId);
        axios_two.get(`user/BlockAndUnblockUser?user=${userId}`)
        setRender(!render)
    }


    return (
        data.user &&
        <div>
            <div className=' bg-white pb-4 rounded-lg mt-4'>


                <div className='border-b-2 p-4 border-gray-100 '>
                    <p className='font-semibold text-xl'>All User</p>
                </div>
                {
                    data.user.map((item, index) => {
                        return (
                            <div key={index} className='border-b-2  flex items-center justify-between p-4 border-gray-100 '>
                                <div className='flex  items-center w-[20%]'>
                                    <div className='bg-gray-200 h-[40px] w-[40px] rounded-full'>
                                        <img src={`/images/post/${item.profile}`} className='objuct-cover rounded-full w-full h-full ' alt="" />
                                    </div>
                                    <div className='ml-3'>
                                        <p>{item.username}</p>
                                    </div>
                                </div>
                                <div className='w-[9%]'>
                                    <p className='text-gray-500'>Reports : <span className='font-semibold'>{item.reports.length}</span></p>
                                </div>
                                <div className='w-[12%]'>{
                                    item.reports.length>0 &&
                                    <p className='text-blue-600  cursor-pointer'
                                        onClick={() => { setModal({status:true,id:item._id}) }}>Reported Users</p>
                                }
                                </div>
                                <div className='w-[10%]'>
                                    <p className=' text-gray-500'>Active Status</p>
                                    <p className='font-semibold text-green-700'>Active</p>
                                </div>
                                <div className='w-[14%]'>
                                <button onClick={()=>{blockUser(item._id)}}
                                     className={`shadow  ${item.isBlock ?'bg-green-600 rounded-full hover:bg-green-700':'bg-red-600 rounded-full hover:bg-red-700'} focus:shadow-outline w-[140px] focus:outline-none text-white font-bold py-1 px-4`} type="submit">
                                        {item.isBlock ?'Unblock User':'Block User'}
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Popup open={modal} onclose={() => { setModal({...modal,status:false}) }}/>
        </div>
        // <div>fghj</div>
    )
}

export default UserBlock