'use client'

import {  useEffect } from 'react'
import { User as UserIcon, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from './_store/hooks'
import { UpdatePointsArgs, updatePointsAsync } from './_features/friends/friendsSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { setUserData } from './_features/user/userSlice'
import toast, { Toaster } from 'react-hot-toast'
import { loadMyFriendsAsync, updatePoint,sortByPoints } from './_features/myFriends/myfriendsSlice'

export type User = {
  _id: string
  totalPointsAwarded: number
}

export type ApiResponse = {
  success: boolean
  message: string
  data: User[]
}

export default function Component() {
 
  const dispatch = useAppDispatch()
  // const allUsers = useAppSelector((state) => state.allUsers)
  const user = useAppSelector((state) => state.user)
  const allUsers = useAppSelector((state) => state.myFriends)
  useEffect(() => {
    const fetchData = async () => {
     
    await dispatch(loadMyFriendsAsync({username:''}))
     dispatch(sortByPoints());
    }

    fetchData()
  }, [dispatch,])

  const topThree = allUsers.slice(0, 3)

  const handleClaimPoints = async (username: string) => {
    const { payload } = await dispatch(updatePointsAsync({ username }))
   

    await dispatch(updatePoint({username,Points:(payload as UpdatePointsArgs).Points}))

    await dispatch(sortByPoints());
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 relative`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Points claimed successfully for {username}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div 
            className="absolute bottom-0 left-0 h-1 bg-green-500" 
            style={{ 
              width: '100%', 
              animation: 'shrink 3s linear forwards' 
            }} 
          ></div>
        </div>
      ),
      { duration: 4000 }
    )

    if (username === user.username) {
      dispatch(setUserData({...user, Points: (payload as UpdatePointsArgs).Points}))
    }
  }

  // Define animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  }

  const podiumVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <Toaster position="top-right" />
  

      {/* Top 3 Podium with Animation */}
      <div className="grid grid-cols-3 gap-4 text-center mb-8">
        {topThree.map((user, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center space-y-2"
            variants={podiumVariants}
            initial="hidden"
            animate="visible"
            layout
            transition={{ type: "spring", stiffness: 200, delay: index * 0.2 }}
          >
            <span className="text-2xl font-bold">{user.username}</span>
            <span className="text-xl">{user.Points}</span>
            <span className="text-orange-500">Prize : ₹{user.Points}</span>
          </motion.div>
        ))}
      </div>

      {/* Ranked List with Animation */}
      <div className="space-y-2">
        <AnimatePresence>
          {allUsers.map((user, index) => (
            <motion.div
              key={user.username}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              transition={{ duration: 0.3 }}
              className={`grid grid-cols-3 w-full items-center justify-between p-4 rounded-lg
                ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                hover:bg-gray-200 transition-colors duration-200`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium cursor-pointer hover:text-blue-500" onClick={() => handleClaimPoints(user.username)}>{user.username}</div>
                  <div className="text-sm text-gray-500">Rank : {index + 1}</div>
                </div>
              </div>

              <div className='flex items-center justify-center '>
                <span className="text-orange-500">Prize : ₹{user.Points}</span>
              </div>

              <div className="flex items-center gap-8 justify-end">
                <span className="text-green-500">{user.Points}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}