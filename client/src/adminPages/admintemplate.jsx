import { useState ,useEffect} from "react";
import{NavLink, Outlet,useNavigate}from"react-router-dom"
import { IoHeartOutline} from "react-icons/io5";
const AdminHome = () => {

    const [open, setOpen] = useState(true);
    const [loggedIn, setLoggedIn] = useState(true);
    let navigate = useNavigate()

    useEffect(()=>{
        let admin = localStorage.getItem('adminToken')
        if(!admin){
            navigate('/admin/login')
        }else{
          navigate('/admin/user')
        }
        },[])

       

 
  const Menus = [
    // { title: "Dashboard", src: "Chart_fill" ,link:"/admin/dash" },
    { title: "User", src: "Chart_fill"  ,link:"/admin/user"},
    { title: "Post", src: "Chat"  ,link:"/admin/post"},
  ];

  return (
    <div className="flex bg-gray-100">
     
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-black h-screen p-5  pt-8 relative duration-300`}
      >
        <IoHeartOutline
          className={`absolute cursor-pointer right-[-10px] top-9 w-7 border-blue-200
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <IoHeartOutline 
            className={`cursor-pointer text-white duration-500 ${
              open && "rotate-[360deg]"
            }`}
         />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Designer
          </h1>
        </div>
        <ul className="pt-6 flex flex-col justify-between h-full">
            <div>
          {Menus.map((Menu, index) => (

            <NavLink to={Menu.link}
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-red-300 text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} `}
            >
                <IoHeartOutline/>
              {/* <img src={`./src/assets/${Menu.src}.png`} /> */}
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </NavLink>
          ))}
          </div>
          <div className="mb-8" onClick={()=>{localStorage.removeItem("adminToken");  navigate('/admin/login')}}>
          <li 
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-red-300 text-gray-300 text-sm items-center gap-x-4 
              Menu.gap ? "mt-9" : "mt-2" `}
            >
                <IoHeartOutline/>
              {/* <img src={`./src/assets/${Menu.src}.png`} /> */}
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                LogOut
              </span>
            </li>
          </div>
        </ul>
      </div>
      <div className="min-h-screen flex-1 p-7">
      <div className='flex justify-end items-center '>
            <p className='mr-4 font-semibold'>Admin</p>
            <div className='w-[40px] h-[40px] bg-gray-500 rounded-full'>

            </div>
        </div>
        <Outlet></Outlet>
      </div>
    </div>
  );
};
export default AdminHome;