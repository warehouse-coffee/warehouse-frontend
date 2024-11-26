'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Coffee, Heart, Lightbulb, Mail, MapPin, Phone, Send, Star, Twitter, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'


export default function AboutUs() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    // Here you would typically send the form data to your backend
    console.log({ name, email, message })

    setIsSubmitted(true)
      // Reset the form
      ; (e.target as HTMLFormElement).reset()
  }

  const handleCloseModal = () => {
    setIsSubmitted(false)
  }

  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isSubmitted])
  return (
    <div className="bg-background text-foreground">

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-background p-8 rounded-lg shadow-xl flex flex-col items-center"
            >
              <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-center">Your message has been sent successfully.</p>
              <Button onClick={handleCloseModal} className="mt-4 text-white">
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative h-[55vh] flex items-center justify-center">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome to Coffee TD</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Transforming coffee storage with AI for enthusiasts, businesses, and warehouses.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { icon: Coffee, title: 'Passion for Coffee', description: 'We live and breathe coffee culture.' },
              { icon: Lightbulb, title: 'Innovation', description: 'Constantly pushing the boundaries of AI in coffee storage.' },
              { icon: Heart, title: 'Customer-Centric', description: 'Your satisfaction is our top priority.' }
            ].map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <value.icon className="h-6 w-6" />
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
          <div className="space-y-8">
            {[
              { year: '2020', event: 'Coffee TD founded with a vision to revolutionize coffee storage' },
              { year: '2021', event: 'Launched our first AI-powered storage management system' },
              { year: '2022', event: 'Expanded services to include price prediction and trend analysis' },
              { year: '2023', event: 'Introduced AI chatbot for personalized assistance' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-right font-bold">{item.year}</div>
                <div className="w-4 h-4 rounded-full bg-primary" />
                <div className="flex-1">{item.event}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Coffee TD?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { icon: Star, title: 'AI Price Prediction', description: 'Stay ahead of market trends' },
              { icon: Send, title: 'AI Chatbot Assistance', description: 'Get instant, personalized help' },
              { icon: Coffee, title: 'Comprehensive Storage', description: 'Effortlessly manage multiple units' }
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-6 w-6" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <a href="mailto:contact@coffeetd.com" className="hover:underline">
                    contact@coffeetd.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span>+123-456-7890</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>123 Coffee Street, Bean City, 12345</span>
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-5 w-5" />
                  <a href="https://twitter.com/coffeetd" className="hover:underline">
                    @coffeetd
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input required={true} name='name' placeholder="Your Name" />
                  <Input required={true} name='email' type="email" placeholder="Your Email" />
                  <Textarea required={true} name='message' placeholder="Your Message" />
                  <Button type="submit" className="w-full text-white">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}