import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex justify-center items-center w-full h-full'>
        <div className='w-[420px] rounded-[12px] gap-[24px] border-[#3F3F46] border-[1px] flex flex-col p-[24px] bg-[#09090B]'>
            <div className='w-full h-[56px] flex justify-center items-center'>
                <img src={`${process.env.PUBLIC_URL}/images/logo.png`} className='w-[154px]'></img>
            </div>
            <div className='flex flex-col gap-[8px] '>
                <p className='text-[#FAFAFA] text-[30px] font-semibold tracking-tighter'>Welcome to Marathonek!</p>
                <p className='text-[#A1A1AA] text-[14px] font-normal leading-[20px]'>Discover and Relive the Excitement of Recent Races Through Stunning Photos!</p>
            </div>
            <div className='flex flex-col gap-[15px] items-center'>
                <Link to={'/Marathons'} className='bg-[#FAFAFA] rounded-[6px] w-full flex justify-center items-center h-[40px]'>
                <button className='text-[#18181B] text-[16px] font-medium leading-[24px]'>
                    🏃 Participant
                </button>
                </Link >
                <p className='text-[#A1A1AA] font-normal text-[16px]'>or</p>
                <Link to={'/login'} className='bg-[#FAFAFA] rounded-[6px] w-full flex justify-center items-center h-[40px]'>
                <button className='text-[#18181B] text-[16px] font-medium leading-[24px]'>
                📷 Photographer
                </button>
                </Link>
                
            </div>
        </div>
    </div>
  )
}

export default Home