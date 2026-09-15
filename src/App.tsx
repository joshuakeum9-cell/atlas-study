import { useCallback } from 'react'
import { useHashRoute } from '@/lib/router'
import { StoreProvider } from '@/state/store'
import { Toaster } from '@/components/ui/Toaster'
import { LandingPage } from '@/components/landing/LandingPage'
import { WorkspacePage } from '@/components/workspace/WorkspacePage'

function Routes() {
  const [route, navigate] = useHashRoute()

  const openDemo = useCallback(() => {
    navigate('workspace')
    window.scrollTo({ top: 0 })
  }, [navigate])

  if (route === 'landing') {
    return <LandingPage onOpenDemo={openDemo} />
  }

  return (
    <WorkspacePage
      onExit={() => navigate('landing')}
      showInsights={route === 'insights'}
      onOpenInsights={() => navigate('insights')}
      onCloseInsights={() => navigate('workspace')}
    />
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Routes />
      <Toaster />
    </StoreProvider>
  )
}
