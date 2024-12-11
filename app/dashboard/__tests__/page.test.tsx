import * as matchers from '@testing-library/jest-dom/matchers'
import { render } from '@testing-library/react'
import { expect, test, vi, beforeEach, describe } from 'vitest'
import { expect as viExpect } from 'vitest'

viExpect.extend(matchers)

import { ROLE_NAMES } from '@/constants'
import { cookieStore, tokenUtils } from '@/lib/auth'

import DashboardPage from '../page'

vi.mock('@/lib/auth', () => ({
  cookieStore: {
    get: vi.fn()
  },
  tokenUtils: {
    getUserInfo: vi.fn()
  }
}))

vi.mock('@/components/dashboard/dashboard-cards', () => ({
  DashboardCards: ({ userRole }: { userRole: string }) => {
    if (userRole === ROLE_NAMES.SUPER_ADMIN) {
      return (
        <div data-testid="dashboard-cards-super-admin">
          Super Admin Dashboard Cards
        </div>
      )
    } else if (userRole === ROLE_NAMES.EMPLOYEE) {
      return (
        <div data-testid="dashboard-cards-employee">
          Employee Dashboard Cards
        </div>
      )
    }
    return null
  }
}))

vi.mock('@/components/dashboard/dashboard-pie-chart', () => ({
  DashboardPieChart: () => <div data-testid="dashboard-pie-chart">Pie Chart</div>
}))

vi.mock('@/components/dashboard/dashboard-trending-chart', () => ({
  DashboardTrendingChart: () => <div data-testid="dashboard-trending-chart">Trending Chart</div>
}))

vi.mock('@/components/dashboard/dashboard-tour', () => ({
  DashboardTour: () => <div data-testid="dashboard-tour">Dashboard Tour</div>
}))

vi.mock('../top-orders', () => ({
  TopOrders: () => <div data-testid="top-orders">Top Orders</div>
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders dashboard for SUPER_ADMIN role', async () => {
    // Arrange
    vi.mocked(tokenUtils.getUserInfo).mockReturnValue({
      role: ROLE_NAMES.SUPER_ADMIN,
      userId: '1',
      username: 'test',
      avatar: 'test'
    })

    // Act
    const { getByTestId, queryByTestId } = render(await DashboardPage())

    // Assert
    expect(getByTestId('dashboard-cards-super-admin')).toBeDefined()
    expect(getByTestId('dashboard-pie-chart')).toBeDefined()
    expect(getByTestId('dashboard-trending-chart')).toBeDefined()
    expect(queryByTestId('top-orders')).toBeNull()
  })

  test('renders dashboard for EMPLOYEE role', async () => {
    // Arrange
    vi.mocked(tokenUtils.getUserInfo).mockReturnValue({
      role: ROLE_NAMES.EMPLOYEE,
      userId: '2',
      username: 'test',
      avatar: 'test'
    })

    // Act
    const { getByTestId, queryByTestId } = render(await DashboardPage())

    // Assert
    expect(getByTestId('dashboard-cards-employee')).toBeDefined()
    expect(queryByTestId('dashboard-pie-chart')).toBeNull()
    expect(queryByTestId('dashboard-trending-chart')).toBeNull()
    expect(getByTestId('top-orders')).toBeDefined()
  })
})