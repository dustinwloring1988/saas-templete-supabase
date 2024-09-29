import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Database, Key, Mail, Shield } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-14 flex items-center bg-background border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link className="flex items-center justify-center" href="/">
            <Shield className="h-6 w-6 mr-2" />
            <span className="font-bold">SaaSTemplate</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#tech-stack">
              Tech Stack
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
              Pricing
            </Link>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Launch Your SaaS Faster with Our Template
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Built with Next.js, Resend, and AppWrite. Everything you need to get your SaaS off the ground quickly and securely.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/register">Sign Up Now</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/otp">View OTP</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Ready-to-use Components</h3>
                <p className="text-gray-500 dark:text-gray-400">Pre-built components to accelerate your development process.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Key className="h-12 w-12 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
                <p className="text-gray-500 dark:text-gray-400">Robust user authentication powered by AppWrite.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Mail className="h-12 w-12 mb-4 text-red-500" />
                <h3 className="text-xl font-bold mb-2">Email Integration</h3>
                <p className="text-gray-500 dark:text-gray-400">Seamless email sending capabilities with Resend.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="tech-stack" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Powerful Tech Stack</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <svg viewBox="0 0 180 180" className="h-12 w-12 mb-4">
                  <mask height="180" id=":R0:mask0_408_134" style={{maskType: 'alpha'}} width="180" x="0" y="0">
                    <circle cx="90" cy="90" fill="black" r="90"></circle>
                  </mask>
                  <g mask="url(#:R0:mask0_408_134)">
                    <circle cx="90" cy="90" data-circle="true" fill="black" r="90"></circle>
                    <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#:R0:paint0_linear_408_134)"></path>
                    <rect fill="url(#:R0:paint1_linear_408_134)" height="72" width="12" x="115" y="54"></rect>
                  </g>
                  <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id=":R0:paint0_linear_408_134" x1="109" x2="144.5" y1="116.5" y2="160.5">
                      <stop stopColor="white"></stop>
                      <stop offset="1" stopColor="white" stopOpacity="0"></stop>
                    </linearGradient>
                    <linearGradient gradientUnits="userSpaceOnUse" id=":R0:paint1_linear_408_134" x1="121" x2="120.799" y1="54" y2="106.875">
                      <stop stopColor="white"></stop>
                      <stop offset="1" stopColor="white" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <h3 className="text-xl font-bold mb-2">Next.js</h3>
                <p className="text-gray-500 dark:text-gray-400">React framework for production</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <svg className="h-12 w-12 mb-4" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#F02E65" d="M256 128c0 70.692-57.308 128-128 128S0 198.692 0 128 57.308 0 128 0s128 57.308 128 128Zm-218.5 0c0 49.98 40.52 90.5 90.5 90.5s90.5-40.52 90.5-90.5S177.98 37.5 128 37.5 37.5 78.02 37.5 128Z"/>
                </svg>
                <h3 className="text-xl font-bold mb-2">AppWrite</h3>
                <p className="text-gray-500 dark:text-gray-400">Open-source backend server</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <svg className="h-12 w-12 mb-4" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#06B6D4" d="M256 128c0 70.692-57.308 128-128 128S0 198.692 0 128 57.308 0 128 0s128 57.308 128 128Zm-218.5 0c0 49.98 40.52 90.5 90.5 90.5s90.5-40.52 90.5-90.5S177.98 37.5 128 37.5 37.5 78.02 37.5 128Z"/>
                </svg>
                <h3 className="text-xl font-bold mb-2">Resend</h3>
                <p className="text-gray-500 dark:text-gray-400">Email API for developers</p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Simple, Transparent Pricing</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Free</h3>
                <p className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal">/month</span></p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Basic features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Limited storage</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-auto" asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </div>
              <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-blue-500">
                <h3 className="text-2xl font-bold mb-4">Basic</h3>
                <p className="text-4xl font-bold mb-6">$9.99<span className="text-lg font-normal">/month</span></p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>All Free features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="mt-auto" asChild>
                  <Link href="/login">Choose Basic</Link>
                </Button>
              </div>
              <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <p className="text-4xl font-bold mb-6">$14.99<span className="text-lg font-normal">/month</span></p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>All Basic features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Unlimited storage</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
                <Button className="mt-auto" asChild>
                  <Link href="/login">Choose Pro</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Launch Your SaaS?</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Get started with our template and launch your SaaS in record time.
                </p>
              </div>
              <Button className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300" asChild>
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-white dark:bg-gray-900 border-t">
        <div className="container mx-auto px-4 md:px-6 flex justify-center items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 SaaSTemplate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}