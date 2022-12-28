
import { IoCloudUploadOutline } from "react-icons/io5";
import React, { useContext, useState } from 'react'
// import Axios from "axios";
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import{useNavigate} from 'react-router-dom'

function Post() {
  const [form, setForm] = useState({discription:"" ,img:"", userId: localStorage.getItem("user")})
  const [file, setFile] = useState({})
  const [invalidImage, setinvalidImage] = useState(null);
  const [error, setError] = useState("")
  
  let navigate =useNavigate()

  let reader = new FileReader(); 
  const fileSelectedHandler = (event) => {
      console.log("jgsdfjhwbcbcknuidwn");
      const imageFile = event.target.files[0];
            const imageFilname = event.target.files[0].name;

            if (!imageFile) {
             setinvalidImage('Please select image.');
              return false;
            }
        
            if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
             setinvalidImage('Please select valid image JPG,JPEG,PNG');
              return false;
            }
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {

//------------- Resize img code ----------------------------------
               var canvas = document.createElement('canvas');
               var ctx = canvas.getContext("2d");
               ctx.drawImage(img, 0, 0);

               var MAX_WIDTH = 700;
               var MAX_HEIGHT = 700;
               var width = img.width;
               var height = img.height;

               if (width > height) {
                 if (width > MAX_WIDTH) {
                   height *= MAX_WIDTH / width;
                   width = MAX_WIDTH;
                 }
               } else {
                 if (height > MAX_HEIGHT) {
                   width *= MAX_HEIGHT / height;
                   height = MAX_HEIGHT;
                 }
               }
               canvas.width = width;
               canvas.height = height;
               var ctx = canvas.getContext("2d");
               ctx.drawImage(img, 0, 0, width, height);
               ctx.canvas.toBlob((blob) => {
                 const file = new File([blob], imageFilname, {
                     type: 'image/jpeg',
                     lastModified: Date.now()
                 });
                 setForm({...form,img:file})   
               }, 'image/jpeg', 1);
             setinvalidImage(null)
             };
              img.onerror = () => {
                    setinvalidImage('Invalid image content.');
                return false;
              };
              //debugger
              img.src = e.target.result;
            };
            reader.readAsDataURL(imageFile);

    }; 
  const onsubmit = async(e) => {
      e.preventDefault()
      console.log('asddsa');
      console.log(form);
      const Data = new FormData();
      for (let key in form) {
          Data.append(key,form[key]) 
      }
     
      if(!form.img ||!form.discription){
        setError('Please select proper image and Discription');
        }else{
          axiosInstance.post('post/addpost', Data).then((response)=>{
          if(response.data.post){
              setFile("")
              navigate('/home')
          }else{
            if (response.data.auth==false) 
            return <div className='fixed top-0 left-0 bg-gray-100 right-0 bottom-0 text-center '><div className='z-20 absolute left-0 right-0 top-[40%]'>{`An error has occurred: ${response.data.message}`}<br></br><button className='bg-gray-800 mt-3 hover:bg-black text-sm text-white font-bold py-1 px-2 rounded' onClick={() => {navigate('/login')}}>Go to Login</button></div></div>
          }
      })
     
         
  }
}
  return (
    <div className='bg-white h-[90vh]'>
    <div className='flex justify-center items-center h-full bg-no-repeat' style={{backgroundImage:`url(./images/wave.png)`}}>
                {/* <div className='text-right cursor-pointer' onClick={() => { setIsPost(false) }}>
                    <p className='text-lg text-gray-400'>X</p>
                </div> */}
                <div className='p-5'>
                <p className='text-center text-xl font-semibold mb-5'>Create New Post</p>
                <div className='flex border-b-[1px] pb-3 border-gray-200'>
                    <div className='h-[40px] w-[40px] mr-5 bg-black rounded-full'></div>

                    <input type="text" className=' w-[80%] bg-transparent placeholder-black '
                        value={form.discription}
                        placeholder='Write Somthing'
                        onChange={(e) => setForm({...form,discription: e.target.value })}
                    />
                </div>
                <div>

                    {file.name && <img className='w-[100px]' alt='file' src={URL.createObjectURL(file)} />}
                </div>
                <label className='text-[70px] text-center flex justify-center mt-5' htmlFor="attach" >
                <IoCloudUploadOutline/>
                </label>
                <p className='text-center text-gray-400'>Attach your Post her</p>
                <input type="file"  className='mt-7 hidden'id='attach' 
                    single
                    filename='post'
                    value={file.image}
                    placeholder="qwertyuio"
                    onChange={(e)=>{fileSelectedHandler(e)}}
                />
                <div className='text-center'>
                    <p className="text-red-500">{error}</p>
                </div>
                <div className='text-center'>
                    <button className='mt-7 w-[80%] bg-[#af6480] hover:bg-[#4b5a7b] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded' onClick={(e) => { onsubmit(e) }}>Upload</button>
                </div>
            </div>
            </div>
            </div>
  )
}

export default Post