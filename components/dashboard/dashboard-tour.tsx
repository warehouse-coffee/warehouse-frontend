'use client'

import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useEffect } from 'react'

import { ROLE_NAMES } from '@/constants'

interface DashboardTourProps {
  userId: string | null
  userRole: string | null
}

export const DashboardTour = ({ userId, userRole }: DashboardTourProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const tourKey = `dashboard-tour-completed-${userId}`
      const hasSeenTour = localStorage.getItem(tourKey)

      if (!hasSeenTour) {
        const superAdminSteps = [
          {
            element: '#dashboard-cards-total-users',
            popover: {
              title: 'Total Users',
              description: 'All registered users across system.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#dashboard-cards-total-companies',
            popover: {
              title: 'Total Companies',
              description: 'All companies registered in system.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#dashboard-cards-cpu-usage',
            popover: {
              title: 'CPU Usage',
              description: 'Current CPU usage of the system.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#dashboard-cards-ram-usage',
            popover: {
              title: 'RAM Usage',
              description: 'Current RAM usage of the system.',
              side: 'bottom',
              align: 'start'
            }
          }
        ]

        const adminSteps = [
          {
            element: '#dashboard-cards-total-employees',
            popover: {
              title: 'Total Employees',
              description: 'All employees registered in system.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#dashboard-cards-total-orders',
            popover: {
              title: 'Total Orders',
              description: 'All orders registered in system.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#dashboard-cards-inventory-value',
            popover: {
              title: 'Inventory Value',
              description: 'Current value of inventory.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#dashboard-cards-high-demand',
            popover: {
              title: 'High Demand Items',
              description: 'Current top-selling items.',
              side: 'bottom',
              align: 'start'
            }
          }
        ]

        const employeeSteps = [
          {
            element: '#dashboard-cards-outbound',
            popover: {
              title: 'Outbound Inventory',
              description: 'Completed outbound inventory this month.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#dashboard-cards-exported',
            popover: {
              title: 'Exported Products',
              description: 'Products exported this month.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#dashboard-cards-expiring',
            popover: {
              title: 'Expiring Products',
              description: 'Products expiring this month.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#dashboard-cards-imported',
            popover: {
              title: 'Imported Products',
              description: 'Products imported this month.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#top-orders',
            popover: {
              title: 'Top Orders',
              description: 'Top 5 orders by quantity.',
              side: 'bottom',
              align: 'start'
            }
          }
        ]

        const chartSteps = [
          {
            element: '#dashboard-trending-chart',
            popover: {
              title: 'Price Prediction Chart',
              description: 'Chart comparing AI predictions with actual prices.',
              side: 'left',
              align: 'start'
            }
          },
          {
            element: '#dashboard-pie-chart',
            popover: {
              title: 'Analysis Chart',
              description: 'Shows the distribution ratio of products in warehouse.',
              side: 'left',
              align: 'start'
            }
          }
        ]

        let steps: any[] = []
        if (userRole === ROLE_NAMES.SUPER_ADMIN) {
          steps = [...superAdminSteps, ...chartSteps]
        } else if (userRole === ROLE_NAMES.ADMIN) {
          steps = [...adminSteps, ...chartSteps]
        } else if (userRole === ROLE_NAMES.EMPLOYEE) {
          steps = employeeSteps
        }

        const driverObj = driver({
          animate: true,
          showProgress: true,
          doneBtnText: 'Done',
          nextBtnText: 'Next →',
          prevBtnText: '← Previous',
          showButtons: ['close', 'next', 'previous'],
          steps,
          onDestroyStarted: () => {
            localStorage.setItem(tourKey, 'true')
            driverObj.destroy()
          },
          onDestroyed: () => {
            localStorage.setItem(tourKey, 'true')
          }
        })

        driverObj.drive()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [userId, userRole])

  return null
}