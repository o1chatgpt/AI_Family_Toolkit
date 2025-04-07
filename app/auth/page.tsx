"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"

export default function AuthPage() {
  const router = useRouter()
  const [showLoginForm, setShowLoginForm] = useState(true)

  const handleLoginSuccess = () => {
    router.push("/")
  }

  const handleSignupSuccess = () => {
    setShowLoginForm(true) // Switch to login after signup
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {showLoginForm ? (
        <LoginForm
          onClose={() => router.push("/")}
          onLogin={handleLoginSuccess}
          onSignup={() => setShowLoginForm(false)}
        />
      ) : (
        <SignupForm
          onClose={() => router.push("/")}
          onSignup={handleSignupSuccess}
          onLogin={() => setShowLoginForm(true)}
        />
      )}
    </div>
  )
}

