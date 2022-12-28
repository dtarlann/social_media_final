import React from 'react'
import { useState, useEffect } from 'react';
import {useNavigate,Link}from "react-router-dom";
// import axios from "axios";
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";

function Search() {
    const [searchModal, setSearchModal] = useState(false)
    const [search, setSearch] = useState([])
    let navigate =useNavigate()

    let userInfo = localStorage.getItem('user')
    const onSearch = (e) => {

        if (e.target.value.length > 0) {

            setSearchModal(true)
        } else {
            setSearchModal(false)
    
        }

        console.log("e.target.value");
        console.log('search call');
        axiosInstance.get(`user/search?user=${e.target.value}`).then((response) => {
            console.log(response);
            console.log("response");
            setSearch(response.data)
            // setSearchRslt(response)
            console.log("searchRslt");
            console.log(search);
        })
    }
    return (
        <div className='bg-white h-[90vh]'>
            <div className='flex flex-col  items-center h-full bg-no-repeat' style={{ backgroundImage: `url(./images/wave.png)` }}>
                <div className='p-4 w-full'>
                <input onChange={(e) => { onSearch(e) }}
                    type="text" className={` appearance-none  text-sm bg-white  ${searchModal ? "rounded-t-xl" :"rounded-xl"} w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-gray-100   focus:border-gray-500`} id="inline-full-name" placeholder='Search' />
                
                {searchModal ?
                <div className='shadow-light bg-gray-50 p-4 w-full rounded-b-lg  h-max-[200px] top-[4.5rem]'>
                    {search&& search?.map((item, index) => {
                        return (
                            <Link  className='flex items-center cursor-pointer hover:bg-gray-300 rounded-lg p-3' key={index}
                            to={`${item._id != userInfo ? "/userProfile" : "/profile"}`} state={{ user: item }}>
                                <div className='h-[40px] w-[40px] bg-gray-600 rounded-full mr-3'>
                                    {
                                        item.profile &&
                                        <img className="h-full w-full object-cover rounded-full" src={`./images/post/${item.profile}`} alt="" />
                                    }
                                </div>
                                <div>{item.username}</div>
                            </Link>
                        )
                    })
                    }
                    
                </div> : null}
                </div>
            </div>
        </div>
    )
}

export default Search