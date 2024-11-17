import { Coffee, Github, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Contact() {
  const team = [
    {
      name: 'Vuong Dinh Quy',
      role: 'CEO & Coffee Enthusiast',
      image: 'https://pic.re/image/1',
      bio: 'Quy has been in the coffee industry for over 15 years and is passionate about leveraging technology to improve coffee storage and distribution.',
      email: 'vuong@coffeetd.com',
      twitter: '@vuongcoffee',
      linkedin: 'vuong-dinh-quy'
    },
    {
      name: 'Pham Van Cao',
      role: 'CTO & AI Specialist',
      image: 'https://pic.re/image/2',
      bio: 'Cao brings his expertise in AI and machine learning to revolutionize how we predict coffee prices and manage inventory.',
      email: 'pham@coffeetd.com',
      twitter: '@phamtech',
      github: 'pham-ai'
    },
    {
      name: 'Lam Quoc Hung',
      role: 'Head of Customer Relations',
      image: 'https://pic.re/image/3',
      bio: 'Hung ensures that our clients receive top-notch support and helps tailor our solutions to meet their specific needs.',
      email: 'lam@coffeetd.com',
      linkedin: 'lam-quoc-hung',
      twitter: '@lamcoffee'
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
          <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
                        Get in touch with our team of coffee and technology experts
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="flex flex-col">
                <CardHeader>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-center">{member.name}</CardTitle>
                  <CardDescription className="text-center">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-4">
                    <a href={`mailto:${member.email}`} className="text-primary hover:text-primary/80">
                      <Mail className="h-5 w-5" />
                      <span className="sr-only">Email</span>
                    </a>
                    {member.twitter && (
                      <a href={`https://twitter.com/${member.twitter}`} className="text-primary hover:text-primary/80">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={`https://www.linkedin.com/in/${member.linkedin}`}
                        className="text-primary hover:text-primary/80"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    )}
                    {member.github && (
                      <a href={`https://github.com/${member.github}`} className="text-primary hover:text-primary/80">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
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
                <form className="space-y-4">
                  <Input placeholder="Your Name" />
                  <Input type="email" placeholder="Your Email" />
                  <Textarea placeholder="Your Message" />
                  <Button type="submit" className="w-full">
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