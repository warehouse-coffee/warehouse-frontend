'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Maximize2, Minimize2, Send, RotateCcw, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Textarea } from './ui/textarea'


interface Message {
    role: 'user' | 'AI'
    content: string
}

export default function ChatBox() {
    const [isMinimized, setIsMinimized] = useState(true)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [isThinking, setIsThinking] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const lastMessageRef = useRef<HTMLDivElement>(null)
    const isInitialMount = useRef(true)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    var api_count = 0

    useEffect(() => {
        const storedMessages = sessionStorage.getItem('chatMessages')
        if (storedMessages) {
            try {
                const parsedMessages = JSON.parse(storedMessages)
                if (Array.isArray(parsedMessages)) {
                    setMessages(parsedMessages)
                }
            } catch (error) {
                console.error('Error parsing stored messages:', error)
            }
        }
    }, [])

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
        } else {
            sessionStorage.setItem('chatMessages', JSON.stringify(messages))
        }
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
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
                textareaRef.current.style.height = '40px';
            // Simulate AI response
            setIsThinking(true)
            try {
                if (api_count == 0) {
                    api_count++
                    const request = await fetch('/api/gemini', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "api_key": "FpK202Eu5u98M3Ikv7Yo",
                            "user_prompt": inputMessage.trim()
                        }),
                    })
                    const response_obj = await request.json()
                    console.log(response_obj)
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
                console.log('Error sending message:', error)
                setError("Failed to send message. wait a few seconds and try again")
            }
        }
    }

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized)
    }

    const resetChat = () => {
        setMessages([])
        setError(null)
        setIsThinking(false)
        api_count = 0
        sessionStorage.removeItem('chatMessages')
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (textareaRef.current) {
            setInputMessage(e.target.value);
            const textarea = textareaRef.current;
            // Reset the height so it can shrink if necessary
            textarea.style.height = 'auto';

            // Calculate the new height, limited to a max of 3 rows worth of content
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 3 * parseFloat(getComputedStyle(textarea).lineHeight);

            textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // const formatMessage = (message: string): JSX.Element[] => {
    //     return 
        
    // };

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4"
        >
            <motion.div
                layout
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                <Card className={`overflow-hidden ${isMinimized ? 'w-16 h-16 rounded-full' : 'w-[60vw] max-w-xl'}`}>
                    <motion.div
                        layout
                        className="flex flex-col h-full"
                        animate={{ height: isMinimized ? '4rem' : '60vh' }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                    >
                        {isMinimized ? (
                            <motion.div
                                className="w-full h-full flex items-center justify-center cursor-pointer"
                                onClick={toggleMinimize}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <MessageCircle className="h-8 w-8 text-primary" />
                            </motion.div>
                        ) : (
                            <>
                                <CardHeader className="p-4 flex-shrink-0">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg"> AI CHAT </CardTitle>
                                        <div className="flex space-x-2">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Button variant="ghost" size="icon" onClick={resetChat} aria-label="Reset chat">
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Button variant="ghost" size="icon" onClick={toggleMinimize} aria-label="Minimize chat">
                                                    <Minimize2 className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 flex-grow overflow-hidden">
                                    <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                                        <AnimatePresence>
                                            {messages.map((message, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                                                    ref={index === messages.length - 1 ? lastMessageRef : null}
                                                >
                                                    <div className={`max-w-[80%] inline-block p-3 rounded-lg whitespace-pre-wrap ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                                        {message.content}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        
                                        {isThinking && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center space-x-2 text-gray-500"
                                            >
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                            </motion.div>
                                        )}
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-red-500 mt-2"
                                            >
                                                {error}
                                            </motion.div>
                                        )}

                                    </ScrollArea>
                                </CardContent>
                                <CardFooter className="p-4 border-t flex-shrink-0">
                                    <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                                        <div className='flex-grow'>
                                            <Textarea
                                                ref={textareaRef}
                                                placeholder="Type a message..."
                                                value={inputMessage}
                                                onChange={(e) => handleChange(e)}
                                                onKeyDown={(e) => handleKeyDown(e)}
                                                className=" bg-slate-200 resize-none overflow-y-auto min-h-10 focus-visible:ring-0"
                                                rows={1}
                                            />
                                        </div>
                                        <Button variant='ghost' className='group' type="submit" size="icon" aria-label="Send message">
                                            <Send className="h-4 w-4 scale-110 group-hover:scale-125 text-blue-500" />
                                        </Button>
                                    </form>
                                </CardFooter>
                            </>
                        )}
                    </motion.div>
                </Card>
            </motion.div>
        </motion.div>
    )
}