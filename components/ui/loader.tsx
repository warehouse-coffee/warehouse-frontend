import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { cn } from '@/lib/utils'

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dashoffset: -125px;
  }
`

const StyledSvg = styled.svg<{ size: string }>`
  width: ${props => props.size};
  height: ${props => props.size};
  transform-origin: center;
  animation: ${rotate} 2s linear infinite;
`

const StyledCircle = styled.circle`
  fill: none;
  stroke-width: 3;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  stroke-opacity: 1;
  animation: ${dash} 1.5s ease-in-out infinite;
`

interface LoaderProps {
  size?: string;
  className?: string;
}

export function Loader({ size = '2rem', className }: LoaderProps) {
  return (
    <StyledSvg viewBox="25 25 50 50" size={size}>
      <StyledCircle
        r="20"
        cy="50"
        cx="50"
        className={cn('stroke-black dark:stroke-[#62c5ff]', className)}
      />
    </StyledSvg>
  )
}