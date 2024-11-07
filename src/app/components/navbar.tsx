'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/app/_store/hooks"
import { setUserData } from "@/app/_features/user/userSlice"
import { useRouter } from "next/navigation"

export function NavbarComponent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const userData = useAppSelector((state) => state.user)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem('token')) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/v1/get-users-info`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
          const data = await response.json()
          const UserData = {
            firstName: data.data.firstName as string,
            lastName: data.data.lastName as string,
            email: data.data.email as string,
            username: data.data.username as string,
            Points: data.data.Points as number,
          }
          dispatch(setUserData(UserData))
        } 
      } catch (e) {
        console.log(e)
      }
    }

    fetchData()
  }, [dispatch, router])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Logo</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/" className={`${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500'} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out`}>
                Home
              </Link>
              <Link href="/leaderboard" className={`${isActive('/leaderboard') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500'} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out`}>
                Leaderboard
              </Link>
              <Link href="/login" className={`${isActive('/login') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500'} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out`}>
                Login
              </Link>
              <Link href="/register" className={`${isActive('/register') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500'} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ease-in-out`}>
                Register
              </Link>
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            {userData.firstName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <User className="h-6 w-6 rounded-full" />
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuItem className="text-sm text-gray-700">
                    <span className="block">Name: {userData.firstName}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm text-gray-700">
                    <span className="block">Email: {userData.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm text-gray-700">
                    <span className="block">Points: {userData.Points}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <Button variant="ghost" onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/" className={`${isActive('/') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500'} hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ease-in-out`}>
            Home
          </Link>
          <Link href="/leaderboard" className={`${isActive('/leaderboard') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500'} hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ease-in-out`}>
            Leaderboard
          </Link>
          <Link href="/login" className={`${isActive('/login') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500'} hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ease-in-out`}>
            Login
          </Link>
          <Link href="/register" className={`${isActive('/register') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500'} hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ease-in-out`}>
            Register
          </Link>
        </div>
        {userData.firstName && (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 rounded-full" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{userData.firstName}</div>
                <div className="text-sm font-medium text-gray-500">{userData.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Button variant="ghost" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left">
                Points: {userData.Points}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}