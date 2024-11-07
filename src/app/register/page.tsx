'use client'
import React from "react";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .refine((value) => !/\d/.test(value), "First name should not contain numbers"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .refine((value) => !/\d/.test(value), "Last name should not contain numbers"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((value) => !/\s/.test(value), "Password cannot contain spaces")
    .refine(
      (value) => /\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value),
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast({
          title: "Registration successful",
          description: "You will be redirected to the login page shortly.",
          duration: 5000,
        })
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        const error = await res.json()
        throw new Error(error.msg)
      }
    } catch (error) {
      console.error("Error during registration:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-3">
      <div className="w-full max-w-md px-3 py-8 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-3">
            {/* First name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                {...register("firstName")}
                type="text"
                id="firstName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            {/* Last name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                {...register("lastName")}
                type="text"
                id="lastName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              id="username"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type="password"
                id="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Password"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <IoMdInformationCircleOutline
                  className="h-5 w-5 text-gray-400 cursor-help"
                  title="Password must be at least 8 characters long, contain no spaces, and include at least one uppercase letter, one lowercase letter, and one number."
                />
              </div>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button and Login Link */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-lg disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
            <span className="text-xs">
              Already have an account?{" "}
              <Link href="/" className="text-blue-500 hover:text-blue-600">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}