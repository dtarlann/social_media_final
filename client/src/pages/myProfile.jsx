import React from 'react'
import UserProfile from "../component/myProfile/myProfile";
// import UserProfile from "../component/userProfile/userProfile";
import Nav from "../component/nav/nav";

function userProfile() {
    return (
        <div className=''>
            {/* <Nav /> */}
            <div className='bg-slate-100 '>
                <div className=' py-8  md:container mx-auto'>
                    <div className=''>
                        <UserProfile />
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default userProfile