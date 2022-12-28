import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

function AdminHome() {
    let navigate = useNavigate()
    useEffect(()=>{
    let admin = localStorage.getItem('adminToken')
    if(!admin){
        navigate('/admin/login')
    }else{
      navigate('/admin/user')
    }
    },[])

  return (
    <div className='text-center text-2xl pt-7 font-bold'></div>
  )
}

export default AdminHome