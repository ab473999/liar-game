import { MainContentTop } from '@/components/layout/MainContentTop'
import { MainContentBody } from '@/components/layout/MainContentBody'
import { PlayerCounter } from '@/components/functional/PlayerCounter'
import { ThemeGrid } from '@/components/functional/ThemeGrid'

export const Home = () => {
  return (
    <>
      <MainContentTop>
        <PlayerCounter />
      </MainContentTop>
      <MainContentBody>
        <ThemeGrid />
      </MainContentBody>
    </>
  )
}