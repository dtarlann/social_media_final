import { useNavigate, NavLink, Link } from "react-router-dom";
import { useContext, useState, useEffect } from 'react';
import { IoSettings, IoLogOut, IoPersonCircle, IoChatbubbleOutline, IoHomeOutline, IoAddCircleOutline, IoHeartOutline, IoSearchOutline } from "react-icons/io5";
import { AppContext ,NotificationCountContext} from "../../contex/appContext";
import { SearchContext } from "../../contex/appContext";
// import axios from "axios";
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import '../../App.css';
import userProfile from "../../pages/myProfile";
import { IoPersonCircleOutline, } from "react-icons/io5";
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Notification from "../../component/notification/notification";

// import Search from "../search/search";

function Nav() {


    const [isPost, setIsPost,isNotification, setIsNotification] = useContext(AppContext)
    const [notificationCount] = useContext(NotificationCountContext)
    const [IsNav, setIsNav] = useState(false)
    const [loggedIn, setLoggedIn] = useState(true)
    const [isprofile, setIsprofile] = useState(false)
    const [search, setSearch] = useState([])
    const [searchModal, setSearchModal] = useState(false)
    const [userDetail, setUserDetails] = useState({})
    const [render, setRender] = useState(false)
    let navigate = useNavigate()

    const showprofile = (e) => {
        e.preventDefault()
        setIsprofile(!isprofile)
    }

    let nav = [
        { title: <IoHomeOutline />, path: "/home" },
        { title: <IoSearchOutline />, path: "/search" },
        { title: <IoAddCircleOutline />, path: "/Addpost" },
        { title: <IoChatbubbleOutline />, path: "/chat" },
        { title: <IoHeartOutline />, path: "/home" }
    ] 

    let userInfo = localStorage.getItem("user")
    useEffect(() => {
        let userInfo = localStorage.getItem("user")
        axiosInstance.get(`user/getuserDetails?user=${userInfo}`).then((response) => {
            console.log("User info response");
            console.log(response);
            localStorage.setItem("userDetails", JSON.stringify(response.data))
            let userDtls = localStorage.getItem("userDetails")
            const dta = JSON.parse(userDtls);
            setUserDetails(response.data)
        })

    }, [render])

    console.log("userDetail   test");
    console.log(userDetail);
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userDetails");
        setLoggedIn(false)
        setIsprofile(false)
        navigate('/login')
    }


    let notify = (message) => {
        Store.addNotification({
            title: "",
            message: message,
            type: "success",
            insert: "",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 3000,
                onScreen: true
            }
        });
    }




    const onSearch = (e) => {
        if (e.target.value.length > 0) {

            setSearchModal(true)
        } else {
            setSearchModal(false)

        }

        axiosInstance.get(`user/search?user=${e.target.value}`).then((response) => {
                
                if (response.data.auth==false) {
                    notify(response.data.message)
                    setTimeout(()=>{
                        navigate('/login')
                    },1000)
                } else {
                    setSearch(response.data)
                    console.log("searchRslt");
                    console.log(search);
                }

            })
    }

    function getUserProfile(userId) {
        console.log("userprofile test demo ");
        console.log(userId);
        console.log("userprofile test demo ");
        navigate('/userProfile')
    }

    return (
        <div className='shadow-light w-full sticky top-0 left-0 w-100 z-50'>

            <ReactNotifications />
            {/* <Search data={searchRslt}/> */}
            <nav className="relative  shadow-light block bg-white border-gray-200 px-2 sm:px-4 py-1 rounded dark:bg-gray-900">
                <div className="container flex flex-wrap justify-between items-center mx-auto">
                    <a href="#" className="flex items-center">
                        {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" /> */}
                        <span className="self-center text-xl font-semibold whitespace-nowrap p-3 dark:text-white" onClick={(e) => { navigate('/home'); e.preventDefault() }}>VIBING</span>
                    </a>

                    <div className="hidden w-full sm:block sm:w-auto">
                        <ul className="flex items-center flex-col p-3 mt-4 bg-gray-50 rounded-lg border-gray-100 sm:flex-row sm:space-x-8 sm:mt-0 sm:text-sm sm:font-medium md:border-0 sm:bg-white dark:bg-gray-800 sm:dark:bg-gray-900 dark:border-gray-700">
                            <li className='text-2xl flex'>
                                <div className="appearance-none  text-sm bg-gray-100  rounded-l-xl  py-2 pl-3 text-gray-700 leading-tight focus:outline-none focus:bg-gray-100   focus:border-gray-500">
                                    <IoSearchOutline />
                                </div>
                                <input onChange={(e) => { onSearch(e) }}
                                    type="text" className="appearance-none  text-sm bg-gray-100  rounded-r-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-gray-100   focus:border-gray-500" id="inline-full-name" placeholder='Search' />
                            </li>
                            <li className='text-2xl cursor-pointer' onClick={() => { navigate('/home') }}>
                                <p className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded sm:bg-transparent sm:text-blue-700 md:p-0 dark:text-white" aria-current="page"><IoHomeOutline /></p>
                            </li>
                            <li className='text-2xl relative'>
                                <p onClick={()=>{setIsNotification(!isNotification)}} className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"><IoHeartOutline /></p>
                                {
                                notificationCount> 0 &&
                                <p className="absolute top-0 right-[-10px] text-[10px] text-white  bg-red-500 flex justify-center items-center rounded-full h-[16px] w-[16px] text-center ">{notificationCount}</p>
                                }
                            </li>
                            <li className='text-2xl' onClick={() => { setIsPost(!isPost) }}>
                                <p className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"><IoAddCircleOutline /></p>
                            </li>
                            <li className='text-2xl'>
                                <p onClick={() => { navigate('/chat') }} className=" cursor-pointer block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"><IoChatbubbleOutline /></p>
                            </li>
                            <li className='text-2xl'>
                                <div className="flex items-center">
                                    <a href="#" onClick={showprofile} className="block m-auto contents py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        <div className='rounded-full h-[28px] flex justify-center items-center w-[28px] inline-block bg-gray-300'>

                                            { userDetail.profile && 
                                            userDetail?.profile !== "null" ?
                                              <img src={`./images/post/${userDetail?.profile}`} className='object-cover rounded-full w-full h-full ' alt="" />
                                                : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                                            }
                                        </div>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {isprofile ?
                        <div className='shadow sm:w-auto bg-white fixed bottom-[0] top-0 right-0 sm:bottom-auto sm:top-[4.3rem] w-[170px] z-40 rounded-lg sm:right-[4rem]'>
                            <ul>
                                <li className='sm:hidden  flex items-center justify-end cursor-pointer py-1 text-right text-gray-700' onClick={showprofile}><span className='mr-3 text-[12px]'>X</span></li>
                                <li className='flex hover:bg-gray-300 px-4 mt-4 items-center cursor-pointer py-1 text-gray-700' onClick={() => { setIsprofile(false); navigate('/profile') }}><span className='mr-3 text-xl' ><IoPersonCircle /></span>Profile</li>
                                <li className='flex hover:bg-gray-300 px-4 items-center cursor-pointer py-1 text-gray-700'><span className='mr-3 text-xl'><IoSettings /></span>Settings</li>
                                <li className='flex hover:bg-gray-300 px-4 mb-5  items-center cursor-pointer py-1 text-gray-700' onClick={logout}><span className='mr-3 text-xl'><IoLogOut /></span>Logout</li>
                            </ul>
                        </div> : null}


                </div>
            </nav>

            <nav className="sm:hidden left-0 right-0 bottom-0 rounded-t-xl  fixed bg-[#e5d0d0ba] border-gray-200 px-2 sm:px-4  dark:bg-gray-900">
                <div className="container flex flex-wrap justify-between items-center mx-auto">
                    <div className=" w-full  sm:w-auto" id="navbar-default">
                        <ul className={` flex   items-center  p-1 justify-between rounded-lg  border-gray-100 sm:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700`}>

                            {
                                nav.map((item, index) => {
                                    return (
                                        <li className='text-2xl'>
                                            <NavLink exact to={item.path} key={index} activeclassName='active' className="block py-2 pr-4 pl-3 text-gray-700 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">{item.title}</NavLink>
                                        </li>
                                    )
                                })
                            }
                            <li className='text-2xl'>
                                <div >
                                    <div onClick={showprofile} className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        <div className='rounded-full h-[28px] w-[28px] inline-block bg-black'>
                                            {
                                                userDetail.profile &&
                                                <img className="h-full w-full object-cover rounded-full" src={`./images/post/${userDetail.profile}`} alt="" />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {isprofile ?
                        <div className='shadow p-4  bg-white absolute top-[4rem] z-40 rounded-lg right-[3rem]'>
                            <ul>
                                <li className='flex items-center cursor-pointer py-1 text-gray-700' onClick={() => { setIsprofile(false); navigate('/profile') }}><span className='mr-3'><IoPersonCircle /></span>Profile</li>
                                <li className='flex items-center cursor-pointer py-1 text-gray-700'><span className='mr-3'><IoSettings /></span>Sttings</li>
                                <li className='flex items-center cursor-pointer py-1 text-gray-700' onClick={logout}><span className='mr-3'><IoLogOut /></span>Logout</li>
                            </ul>
                        </div> : null}
                </div>
            </nav>



            {searchModal ?
                <div className='shadow-light bg-white p-4 w-[25%] rounded-lg absolute right-[20%] z-30  h-max-[200px] top-[4.5rem]'>
                    {search.map((item, index) => {
                        return (
                            <Link className='flex items-center cursor-pointer hover:bg-gray-300 rounded-lg p-3' key={index}
                                to={`${item._id != userInfo ? "/userProfile" : "/profile"}`} state={{ user: item }}
                                onClick={() => { setSearchModal(false) }}>
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



                {isNotification ?
                <Notification/>
                : null}
        </div>
    )
}

export default Nav