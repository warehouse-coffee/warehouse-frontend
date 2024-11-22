import { Coffee, Heart, Lightbulb, Mail, MapPin, Phone, Send, Star, Twitter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function AboutUs() {
  return (
    <div className='h-screen overflow-hidden w-screen'>
      <div className='h-[4.5rem]'></div>
      <div className="bg-background text-foreground h-full w-screen overflow-y-auto">
        <section className="relative h-[50vh] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(\'/placeholder.svg?height=1080&width=1920\')' }}
          />
          <div className="absolute inset-0 bg-black/50" />
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
                  <form className="space-y-4">
                    <Input placeholder="Your Name" />
                    <Input type="email" placeholder="Your Email" />
                    <Textarea placeholder="Your Message" />
                    <Button className="w-full text-white">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}