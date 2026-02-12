import { useCallback } from 'react'
import { track, trackPageView, identify, reset, type TrackEventName, type TrackProperties } from '@/lib/utils/tracker'

// Hook for tracking events in components
export function useTracker() {
  const trackEvent = useCallback((event: TrackEventName, properties?: TrackProperties) => {
    track(event, properties)
  }, [])

  const trackPage = useCallback((path: string, properties?: TrackProperties) => {
    trackPageView(path, properties)
  }, [])

  const identifyUser = useCallback((userId: string, traits?: TrackProperties) => {
    identify(userId, traits)
  }, [])

  const resetUser = useCallback(() => {
    reset()
  }, [])

  return {
    track: trackEvent,
    trackPageView: trackPage,
    identify: identifyUser,
    reset: resetUser,
  }
}
