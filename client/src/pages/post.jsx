import React from 'react'
import Post from "../component/post/post";
import Nav from "../component/nav/nav";

function post() {
  return (
    <div className='bg-gray-100'>
        {/* <Nav/> */}
        <div className='py-8 min-h-[80vh] '>
        <Post/>
        </div>
    </div>
  )
}

export default post