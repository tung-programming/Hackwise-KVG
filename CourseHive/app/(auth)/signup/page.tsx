'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github, Mail } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">SIGN UP:</h1>
            <p className="text-muted-foreground">Join the CourseHive community</p>
          </div>

          {/* Auth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 gap-3 border-border/60"
            >
              <Mail className="w-5 h-5" />
              <span>Continue with Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 gap-3 border-border/60"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">or</span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline font-semibold">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
