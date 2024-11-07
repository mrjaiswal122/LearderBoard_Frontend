'use client'

import { useState, useEffect } from 'react'
import { User as UserIcon, } from "lucide-react"
import { useAppDispatch,useAppSelector } from '../_store/hooks'
import { setAllFriend,  } from '../_features/friends/friendsSlice'
import PopUp from '../components/PopUp'


export type User = {
  _id: string
  totalPointsAwarded: number
}

type ApiResponse = {
  success: boolean
  message: string
  data: User[]
}
type PopUpData={pointsAwarded:0,date:''}[]

export default function Component() {
  const [period, setPeriod] = useState("daily")
  const dispatch = useAppDispatch()
  const allUsers = useAppSelector((state) => state.allUsers)
  const [pointsHistory,setPointsHistory] = useState<PopUpData>()
  const [showPopUp,setShowPopUp] = useState(false)
  const [username,setUsername]=useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/v1/your-${period}-history`)
        const data: ApiResponse = await response.json()
       
        dispatch(setAllFriend(data.data))
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [dispatch, period])

  const topThree = allUsers.slice(0, 3)

  const handleModulePopUp = async (username: string) => {
  const response= await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/v1/your-history`,{
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username })
})
  const data=await response.json()
   setPointsHistory(data.data)
   setShowPopUp(true)
   setUsername(username)
  }
  const handleClosePopUp=(e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    const id=(e.target as HTMLDivElement).id;
    if(id==='popUp'){
      setShowPopUp(false);
      setPointsHistory(undefined);
    }
  }
  // Define animation variants
 

  return (
    <div className="max-w-2xl mx-auto mt-6 ">
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {['daily', 'weekly', 'monthly'].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 rounded transition-colors duration-200 
              ${period === tab ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800'}
              hover:bg-orange-400 active:bg-orange-600`}
            onClick={() => setPeriod(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Top 3 Podium with Animation */}
      <div className="grid grid-cols-3 gap-4 text-center mb-8">
        {topThree.map((user, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-2xl font-bold">{user._id}</span>
            <span className="text-xl">{user.totalPointsAwarded}</span>
            <span className="text-orange-500">Prize : ₹{user.totalPointsAwarded}</span>
          </div>
        ))}
      </div>

      {/* Ranked List with Animation */}
      <div className="space-y-2">
        <>
          {allUsers.map((user, index) => (
            <div
              key={user._id}
              className={`grid grid-cols-3 w-full items-center justify-between p-4 rounded-lg
                ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                hover:bg-gray-200 transition-colors duration-200`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium cursor-pointer hover:text-blue-500" onClick={() => handleModulePopUp(user._id)}>{user._id}</div>
                  <div className="text-sm text-gray-500">Rank : {index + 1}</div>
                </div>
              </div>

              <div className='flex items-center justify-center '>
                <span className="text-orange-500">Prize : ₹{user.totalPointsAwarded}</span>
              </div>

              <div className="flex items-center gap-8 justify-end">
                <span className="text-green-500">{user.totalPointsAwarded}</span>
              </div>
            </div>
          ))}
        </>
      </div>
      {showPopUp && (
        <div className='fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center' onClick={(e)=>handleClosePopUp(e)} id='popUp'>
           <div className='flex flex-col gap-3  bg-white w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[40vw] max-h-[80vh] px-3 rounded-lg'>
             <h2 className='text-2xl font-bold '> {username}{'\'s History'}</h2>
            <div className='overflow-scroll overflow-x-hidden '>
             {pointsHistory?.map((data,index)=>(
               <PopUp key={index} data={data}/>
              ))}
              </div>

              <span >
                <button className='px-3 py-2 mb-3  bg-blue-600  rounded-lg' onClick={()=>{setShowPopUp(false);setPointsHistory(undefined)}}>Close</button>
              </span>

           </div>
        </div>
      )}
    </div>
  )
}