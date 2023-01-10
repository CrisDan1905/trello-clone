import { useEffect, useState } from 'react'
import { load } from './api'
import { AppState } from './state/appStateReducer'

type InjectedProps = {
  initialState: AppState
}

type PropsWithoutInjected<TBaseProps> = Omit<TBaseProps, keyof InjectedProps>

export function withInitialState<TProps> (WrappedComponent: React.ComponentType<PropsWithoutInjected<TProps> & InjectedProps>): Function {
  const HOC = (props: PropsWithoutInjected<TProps>): React.ReactElement => {
    const [initialState, setInitialState] = useState<AppState>({
      lists: [],
      draggedItem: null
    })

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | undefined>()

    useEffect(() => {
      const fetchInitialState = async (): Promise<void> => {
        try {
          const data = await load()
          setInitialState(data)
        } catch (e) {
          if (e instanceof Error) {
            setError(e)
          }
        }
        setIsLoading(false)
      }
      void fetchInitialState()
    }, [])

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <div>{error.message}</div>
    }
    return <WrappedComponent {...props} initialState={initialState} />
  }

  return HOC
}
