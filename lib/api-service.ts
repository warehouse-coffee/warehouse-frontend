import {
  IdentityUserClient,
  Client,
  SignInCommand,
  SwaggerException
} from '@/app/api/web-api-client'

interface AntiforgeryResponse {
  token: string
  cookie?: string
}

export class ApiClientService {
  private static createClient<T>(
    ClientClass: new (baseUrl: string, http?: any, token?: string, xsrf?: string) => T,
    config: { token?: string; xsrfToken?: string }
  ): T {
    return new ClientClass(
      process.env.NEXT_PUBLIC_BACKEND_API_URL!,
      undefined,
      config.token,
      config.xsrfToken
    )
  }

  static async getAntiforgeryData(token: string): Promise<AntiforgeryResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/antiforgery/token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const xsrfToken = await response.text()
      const cookie = response.headers.get('Set-Cookie')

      return {
        token: xsrfToken,
        cookie: cookie || undefined
      }
    } catch (error) {
      throw new Error('Failed to get antiforgery data')
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const client = this.createClient(IdentityUserClient, {})
      const command = new SignInCommand()
      command.init({ email, password })
      return await client.signIn(command)
    } catch (error) {
      if (error instanceof SwaggerException) {
        throw new Error(error.message)
      }
      throw new Error('Login failed')
    }
  }

  static async logout(userId: string, token: string) {
    try {
      const client = this.createClient(IdentityUserClient, { token })
      return await client.logout(userId)
    } catch (error) {
      throw new Error('Logout failed')
    }
  }

  static async validateResetToken(token: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/validate-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      if (!response.ok) {
        throw new Error('Invalid or expired token')
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw new Error('Failed to validate reset token')
    }
  }

  static async resetPassword(token: string, newPassword: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      return true
    } catch (error) {
      throw new Error('Failed to reset password')
    }
  }
}