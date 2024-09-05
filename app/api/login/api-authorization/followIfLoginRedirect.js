const baseUrl = process.env.NEXT_BACKEND_API_URL
const loginUrl = `${baseUrl}/IdentityUser/Account/signin`

export default function followIfLoginRedirect(response) {
  if (typeof window !== 'undefined' && response.redirected && response.url.startsWith(loginUrl)) {
    window.location.href = `${loginUrl}?ReturnUrl=${window.location.pathname}`
  }
  return response
}