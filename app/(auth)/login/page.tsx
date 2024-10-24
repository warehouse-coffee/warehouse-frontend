import dynamic from 'next/dynamic'

const LoginMain = dynamic(() => import('./login-main'))

export default function Login() {
  return (
    <LoginMain />
  )
}