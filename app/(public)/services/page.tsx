'use client'

import { BarChart3, Coffee, DollarSign, LineChart, ShoppingCart, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Services() {
  const handleGetStarted = () => {
    console.log('Get Started')
  }

  const services = [
    {
      title: 'Coffee Inventory Management',
      description: 'Streamline your coffee inventory with real-time tracking and management tools.',
      icon: Coffee,
      benefits: ['Reduce waste', 'Optimize stock levels', 'Improve order accuracy']
    },
    {
      title: 'AI-Driven Coffee Price Forecasting',
      description: 'Utilize advanced AI algorithms to predict coffee price trends and make informed purchasing decisions.',
      icon: LineChart,
      benefits: ['Stay ahead of market fluctuations', 'Maximize profit margins', 'Enhance budgeting accuracy']
    },
    {
      title: 'Supplier Management',
      description: 'Manage relationships with coffee suppliers efficiently through our integrated platform.',
      icon: Users,
      benefits: ['Simplify communication', 'Track supplier performance', 'Negotiate better deals']
    },
    {
      title: 'Sales Analytics Dashboard',
      description: 'Access comprehensive analytics to monitor sales performance and customer preferences.',
      icon: BarChart3,
      benefits: ['Make data-driven decisions', 'Identify growth opportunities', 'Enhance marketing strategies']
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[40vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(\'/placeholder.svg?height=1080&width=1920\')' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Empowering your coffee business with cutting-edge technology and insights
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <service.icon className="h-6 w-6 text-primary" />
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-lg mb-4">{service.description}</CardDescription>
                <h3 className="text-xl font-semibold mb-2">Benefits</h3>
                <ul className="list-disc list-inside space-y-1">
                  {service.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Ready to Optimize Your Coffee Operations?</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              Get started today with a free demo or consultation and see how Coffee TD can take your warehouse management to
              the next level.
            </CardDescription>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleGetStarted} size="lg" className="font-semibold text-white">
              <ShoppingCart className="mr-2 h-5 w-5" /> Get Started
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}