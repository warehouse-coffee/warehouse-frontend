'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2, Send, RotateCcw, MessageCircle, Bot } from 'lucide-react'
import React, { useState, useEffect, useRef, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import useClickOutside from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { Textarea } from './ui/textarea'

interface Message {
    role: 'user' | 'AI'
    content: string
}

const suggestionButtons = [
  {
    text: 'Empty Storage Status',
    prompt: 'What is the current empty storage status?'
  },
  {
    text: 'Empty Area Check',
    prompt: 'Can you check for any empty areas?'
  },
  {
    text: 'Tomorrow\'s Coffee Price',
    prompt: 'What is the price of coffee tomorrow?'
  },
  {
    text: 'Today\'s Coffee Price',
    prompt: 'What is the current coffee price today?'
  },
  {
    text: 'Near Expired Products',
    prompt: 'Show me the list of near expired products'
  },
  {
    text: 'Most Valuable Product',
    prompt: 'What is our most valuable product?'
  }
]

export default function ChatBox() {
  const [isMinimized, setIsMinimized] = useState<boolean>(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isThinking, setIsThinking] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
  const isInitialMount = useRef<boolean>(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  var api_count = 0
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const chatBoxRef = useRef<HTMLDivElement>(null)

  const { userInfo, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && userInfo?.userId) {
      const storedMessages = sessionStorage.getItem(`chatMessages_${userInfo.userId}`)
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages)
          if (Array.isArray(parsedMessages)) {
            setMessages(parsedMessages)
            setShowSuggestions(false)
          }
        } catch (error) {
          console.error('Error parsing stored messages:', error)
        }
      } else {
        setMessages([])
        setShowSuggestions(true)
      }
    } else {
      setMessages([])
      setShowSuggestions(true)
    }
  }, [isAuthenticated, userInfo])

  useEffect(() => {
    if (!isInitialMount.current && isAuthenticated && userInfo?.userId) {
      sessionStorage.setItem(`chatMessages_${userInfo.userId}`, JSON.stringify(messages))
    } else {
      isInitialMount.current = false
    }
    scrollToBottom()
  }, [messages, isAuthenticated, userInfo])

  useEffect(() => {
    if (!isMinimized && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom()
      }, 300)
    }
  }, [isMinimized, messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const resetChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setMessages([])
    setError(null)
    setIsThinking(false)
    setShowSuggestions(true)
    api_count = 0
    if (isAuthenticated && userInfo?.userId) {
      sessionStorage.removeItem(`chatMessages_${userInfo.userId}`)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const newMessage: Message = { role: 'user', content: inputMessage.trim() }
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInputMessage('')
      setError(null)
      if (textareaRef.current)
        textareaRef.current.style.height = '40px'
      setIsThinking(true)
      try {
        if (api_count == 0) {
          api_count++
          abortControllerRef.current = new AbortController()
          const request = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'api_key': 'FpK202Eu5u98M3Ikv7Yo',
              'user_prompt': inputMessage.trim()
            }),
            signal: abortControllerRef.current.signal
          })
          const response_obj = await request.json()
          // console.log(response_obj)
          api_count = 0
          setIsThinking(false)
          if (response_obj.statusText) {
            setError(response_obj.statusText)
            return
          }
          const aiResponse: Message = { role: 'AI', content: response_obj.response }
          setMessages(prevMessages => [...prevMessages, aiResponse])
        }
      } catch (error) {
        api_count = 0
        setIsThinking(false)
        // console.log('Error sending message:', error)
        setError('Failed to send message. wait a few seconds and try again')
      }
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (!isMinimized) {
      setTimeout(() => {
        scrollToBottom()
      }, 300)
    } else if (messages.length === 0) {
      setShowSuggestions(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      setInputMessage(e.target.value)
      const textarea = textareaRef.current
      textarea.style.height = 'auto'

      const scrollHeight = textarea.scrollHeight
      const maxHeight = 3 * parseFloat(getComputedStyle(textarea).lineHeight)

      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleSuggestionClick = async (prompt: string) => {
    setShowSuggestions(false)

    const newMessage: Message = { role: 'user', content: prompt }
    setMessages(prevMessages => [...prevMessages, newMessage])

    setIsThinking(true)
    try {
      if (api_count == 0) {
        api_count++
        abortControllerRef.current = new AbortController()
        const request = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'api_key': 'FpK202Eu5u98M3Ikv7Yo',
            'user_prompt': prompt
          }),
          signal: abortControllerRef.current.signal
        })
        const response_obj = await request.json()
        api_count = 0
        setIsThinking(false)
        if (response_obj.statusText) {
          setError(response_obj.statusText)
          return
        }
        const aiResponse: Message = { role: 'AI', content: response_obj.response }
        setMessages(prevMessages => [...prevMessages, aiResponse])
      }
    } catch (error) {
      api_count = 0
      setIsThinking(false)
      setError('Failed to send message. wait a few seconds and try again')
    }
  }

  const handleClickOutside = useCallback(() => {
    if (!isMinimized) {
      setIsMinimized(true)
    }
  }, [isMinimized])

  useClickOutside(chatBoxRef, handleClickOutside)

  return (
    <motion.div
      ref={chatBoxRef}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
      className={cn('fixed bottom-5 right-5 z-[9999]')}
    >
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
      >
        <Card className={`overflow-hidden shadow-xl border-0 bg-[#111111]/90 backdrop-blur-md
          ${isMinimized ? 'h-12 rounded-full transition-all duration-300' : 'w-[400px] rounded-xl'}`}>
          {isMinimized ? (
            <motion.div
              className="relative w-full h-full flex items-center justify-center cursor-pointer
                bg-gradient-to-r from-[#4DA6FF] to-[#65B1FF] group"
              onClick={toggleMinimize}
              initial={{ width: '3rem' }}
              whileHover={{
                width: '9rem',
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-12 flex justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span
                  className="text-white text-sm font-medium -ml-1 whitespace-nowrap overflow-hidden w-0
                    group-hover:w-auto transition-all duration-250 opacity-0 group-hover:opacity-100"
                >
                  Chat with AI
                </span>
              </div>

              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                  bg-gradient-to-r from-[#4DA6FF]/20 to-[#65B1FF]/20 blur-md -z-10"
                initial={{ scale: 0.8 }}
                whileHover={{
                  scale: 1.2,
                  transition: {
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 1
                  }
                }}
              />
            </motion.div>
          ) : (
            <>
              <CardHeader className="px-4 py-3 flex-shrink-0 border-b border-[#222222] bg-gradient-to-r
                from-[#4DA6FF] to-[#65B1FF]">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center gap-1.5">
                    <Bot className="h-[1.4rem] w-[1.4rem]" />
                    <span className="text-[1.1rem] font-medium">AI Assistant</span>
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetChat}
                      className="hover:bg-white/20 text-white/90 h-8 w-8"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMinimize}
                      className="hover:bg-white/20 text-white/90 h-8 w-8"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-3.5 pt-4 pb-0 flex-grow overflow-hidden bg-[#111111] h-[400px]">
                <ScrollArea className="h-full pr-3">
                  {showSuggestions && !isMinimized && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <motion.div
                        className="max-w-[85%] inline-block px-3 py-2 shadow-sm bg-[#1A1A1A] text-gray-100 rounded-[.75rem] rounded-tl-sm border border-[#2A2A2A]"
                      >
                        <motion.p className="text-sm leading-relaxed whitespace-pre-wrap">
                          Hello! I&apos;m your AI Assistant. How can I help you today?
                        </motion.p>
                      </motion.div>

                      <motion.div
                        className="max-w-[85%] inline-block px-3 py-2 shadow-sm bg-[#1A1A1A] text-gray-100 rounded-[.75rem] rounded-tl-sm border border-[#2A2A2A]"
                      >
                        <motion.p className="text-sm leading-relaxed whitespace-pre-wrap">
                          Here are some frequently asked questions you might be interested in:
                        </motion.p>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-3">
                        {suggestionButtons.map((button, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full text-sm py-2 px-3 h-auto whitespace-normal text-left bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#2A2A2A] text-gray-100"
                            onClick={() => handleSuggestionClick(button.prompt)}
                          >
                            {button.text}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {messages.length > 0 && (
                    <AnimatePresence mode="popLayout">
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{
                            opacity: 0,
                            x: message.role === 'user' ? 50 : -50,
                            scale: 0.8
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            transition: {
                              type: 'spring',
                              stiffness: 300,
                              damping: 24
                            }
                          }}
                          className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`max-w-[85%] inline-block px-3 py-2 shadow-sm
                            ${message.role === 'user'
                          ? 'bg-gradient-to-r from-[#4DA6FF] to-[#65B1FF] text-white rounded-[.75rem] rounded-br-sm'
                          : 'bg-[#1A1A1A] text-gray-100 rounded-[.75rem] rounded-tl-sm border border-[#2A2A2A]'
                        }`}
                          >
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { delay: 0.1 }
                              }}
                              className="text-sm leading-relaxed whitespace-pre-wrap"
                            >
                              {message.content}
                            </motion.p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}

                  {isThinking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-1.5 ml-2 mb-5"
                    >
                      <motion.div
                        className="w-2 h-2 bg-[#4DA6FF] rounded-full"
                        animate={{
                          y: [0, -6, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          times: [0, 0.5, 1]
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[#4DA6FF] rounded-full"
                        animate={{
                          y: [0, -6, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          times: [0, 0.5, 1],
                          delay: 0.15
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[#4DA6FF] rounded-full"
                        animate={{
                          y: [0, -6, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          times: [0, 0.5, 1],
                          delay: 0.3
                        }}
                      />
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-4 border-t border-[#222222] bg-[#111111]">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-h-10 max-h-32 bg-[#1A1A1A] border border-[#2A2A2A] resize-none overflow-y-auto rounded-[.65rem] text-sm text-gray-100 placeholder:text-gray-500"
                    rows={1}
                  />
                  <Button
                    variant='ghost'
                    className='group bg-[#4DA6FF] hover:bg-[#3d96ff] rounded-[.65rem] transition-colors'
                    type="submit"
                    size="icon"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4 scale-110 group-hover:scale-125 text-white" />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}