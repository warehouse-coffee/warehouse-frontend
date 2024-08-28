import { Noto_Sans, Italiana } from 'next/font/google'

const fontSans = Noto_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans'
})

const fontItaliana = Italiana({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-italiana'
})

export {
  fontSans,
  fontItaliana
}
