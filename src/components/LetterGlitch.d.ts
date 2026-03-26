declare module '@/components/LetterGlitch' {
  import { FC } from 'react'

  interface LetterGlitchProps {
    glitchSpeed?: number
    centerVignette?: boolean
    outerVignette?: boolean
    smooth?: boolean
  }

  const LetterGlitch: FC<LetterGlitchProps>
  export default LetterGlitch
}