import React, { useContext } from 'react'
import { CiBellOn, CiBookmark, CiHashtag, CiHome, CiMail, CiSearch, CiUser } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { HiOutlineUserGroup } from 'react-icons/hi2'

const Sidebar = () => {
    const { user } = useContext(UserContext)
    return (
        <>
            {user ?
                <div className="flex flex-row items-center p-2 my-4">
                    <img src={`${import.meta.env.VITE_CDN}/uploads/user/${user.profile_picture ?? 'default_profile.png'}`} alt="Profile Picture" className="w-12 h-12 rounded-full" />
                    <div className="ml-4">
                        <h2 className="text-lg font-bold">{user.username}</h2>
                    </div>
                </div>
                : 
                null}
            <div className="flex flex-col items-center justify-center px-2">
                <Link className="p-2 my-1 flex items-center w-full transition-colors cursor-pointer hover:bg-gray-200 rounded-full" to='/'>
                    <CiHome size='24' color='rgb(107 114 128)' />
                    <span className="ml-2 text-gray-700">Home</span>
                </Link>
                <Link className="p-2 my-1 flex items-center w-full transition-colors cursor-pointer hover:bg-gray-200 rounded-full" to={`/community`}>
                    <CiHashtag size='24' color='rgb(107 114 128)' />
                    <span className="ml-2 text-gray-700">Community</span>
                </Link>
                <Link className="p-2 my-1 flex items-center w-full transition-colors cursor-pointer hover:bg-gray-200 rounded-full" to='/search'>
                    <CiSearch size='24' color='rgb(107 114 128)' />
                    <span className="ml-2 text-gray-700">Search</span>
                </Link>
                <Link className="p-2 my-1 flex items-center w-full transition-colors cursor-pointer hover:bg-gray-200 rounded-full" to='/notification'>
                    <CiBellOn size='24' color='rgb(107 114 128)' />
                    <span className="ml-2 text-gray-700">Notifications</span>
                </Link>
                <Link className="p-2 my-1 flex items-center w-full transition-colors cursor-pointer hover:bg-gray-200 rounded-full" to='/saved-post'>
                    <CiBookmark size='24' color='rgb(107 114 128)' />
                    <span className="ml-2 text-gray-700">Saved posts</span>
                </Link>
                <Link className="p-2 my-1 flex items-center w-full transition-colors cursor-pointer hover:bg-gray-200 rounded-full" to={`/profile/${user ? user._id : ''}`}>
                    <CiUser size='24' color='rgb(107 114 128)' />
                    <span className="ml-2 text-gray-700">Account</span>
                </Link>
                <Link className="p-2 my-1 flex justify-center items-center w-full transition-colors cursor-pointer bg-primary-900 hover:bg-primary-700 rounded-full" to='/create-post'>
                    <span className="text-white">Create Post</span>
                </Link>
            </div>
        </>
    )
}

export default Sidebar