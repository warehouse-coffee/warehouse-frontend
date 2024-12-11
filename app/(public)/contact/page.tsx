'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Github, Linkedin, Mail, MapPin, Phone, Twitter, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const team = [
    {
      name: 'Vuong Dinh Quy',
      role: 'CEO & Coffee Enthusiast',
      image: 'https://avatar.iran.liara.run/public/boy?q=1',
      bio: 'Quy has been in the coffee industry for over 15 years and is passionate about leveraging technology to improve coffee storage and distribution.',
      email: 'vuong@coffeetd.com',
      twitter: '@vuongcoffee',
      linkedin: 'vuong-dinh-quy'
    },
    {
      name: 'Pham Van Cao',
      role: 'CTO & AI Specialist',
      image: 'https://avatar.iran.liara.run/public/boy?q=2',
      bio: 'Cao brings his expertise in AI and machine learning to revolutionize how we predict coffee prices and manage inventory.',
      email: 'pham@coffeetd.com',
      twitter: '@phamtech',
      github: 'pham-ai'
    },
    {
      name: 'Lam Quoc Hung',
      role: 'Head of Customer Relations',
      image: 'https://avatar.iran.liara.run/public/boy?q=3',
      bio: 'Hung ensures that our clients receive top-notch support and helps tailor our solutions to meet their specific needs.',
      email: 'lam@coffeetd.com',
      linkedin: 'lam-quoc-hung',
      twitter: '@lamcoffee'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // const formData = new FormData(e.target as HTMLFormElement)
    // const name = formData.get('name') as string
    // const email = formData.get('email') as string
    // const message = formData.get('message') as string

    // Here you would typically send the form data to your backend
    // console.log({ name, email, message })

    setIsSubmitted(true);
    // Reset the form
    (e.target as HTMLFormElement).reset()
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
    <div className="bg-background">
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
          <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Get in touch with our team of coffee and technology experts
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 mb-12 w-full">
        <section className="mb-16 w-full">
          <h2 className="text-3xl font-bold mb-8 text-center w-full">Meet Our Team</h2>
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {team.map((member) => (
              <Card className="w-full md:w-1/3" key={member.name}>
                <CardHeader>
                  <div className="size-32 relative mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover self-center"
                    />
                  </div>

                  <CardTitle className="text-center">{member.name}</CardTitle>
                  <CardDescription className="text-center">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-4">
                    <a href={`mailto:${member.email}`} className="text-primary hover:text-primary/80">
                      <Mail className="h-5 w-5" />
                      <span className="sr-only">Email {member.name}</span>
                    </a>
                    {member.twitter && (
                      <a href={`https://twitter.com/${member.twitter}`} className="text-primary hover:text-primary/80">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">{member.name}&apos;s Twitter</span>
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={`https://www.linkedin.com/in/${member.linkedin}`}
                        className="text-primary hover:text-primary/80"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">{member.name}&apos;s LinkedIn</span>
                      </a>
                    )}
                    {member.github && (
                      <a href={`https://github.com/${member.github}`} className="text-primary hover:text-primary/80">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">{member.name}&apos;s GitHub</span>
                      </a>
                    )}
                  </div>
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
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>123 Coffee Street, Bean City, 12345</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:info@coffeetd.com" className="hover:underline">
                    info@coffeetd.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-primary" />
                  <span>Monday - Friday: 9am - 5pm</span>
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
