import {
  IdentityUserClient,
  Client,
  SignInCommand,
  SwaggerException
} from '@/app/api/web-api-client'

export class ApiClientService {
  private static createClient<T>(
    ClientClass: new (baseUrl: string, http?: any, token?: string, xsrf?: string) => T,
    config: { token?: string; xsrfToken?: string }
  ): T {
    return new ClientClass(
      process.env.NEXT_BACKEND_API_URL!,
      undefined,
      config.token,
      config.xsrfToken
    )
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

  static async logout(userId: string, token: string, xsrfToken: string) {
    try {
      const client = this.createClient(IdentityUserClient, { token, xsrfToken })
      return await client.logout(userId)
    } catch (error) {
      throw new Error('Logout failed')
    }
  }

  static async getAntiforgeryToken(token: string) {
    const client = this.createClient(Client, { token })
    return await client.getAntiforgeryToken()
  }
}