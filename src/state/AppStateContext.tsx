import { createContext, Dispatch, useContext, useEffect } from 'react'
import { useImmerReducer } from 'use-immer'
import { save } from '../api'
import { DragItem } from '../DragItem'
import { withInitialState } from '../withInitialState'
import { Action } from './actions'
import { AppState, appStateReducer, List, Task } from './appStateReducer'

type AppStateContextProps = {
  lists: List[]
  getTasksByListId: (id: string) => Task[]
  dispatch: Dispatch<Action>
  draggedItem: DragItem | null
}

const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps)

type AppStateProviderProps = {
  children: React.ReactNode
  initialstate: AppState
}

export const AppStateProvider = withInitialState<AppStateProviderProps>(({ children, initialState }) => {
  const [state, dispatch] = useImmerReducer(appStateReducer, initialState)
  const { lists, draggedItem } = state

  const getTasksByListId = (id: string): Task[] => {
    return lists.find((list) => list.id === id)?.tasks ?? []
  }

  useEffect(() => {
    void save(state)
  }, [state])

  return (
    <AppStateContext.Provider value={{ lists, getTasksByListId, dispatch, draggedItem }}>
      {children}
    </AppStateContext.Provider>
  )
})

export const useAppState = (): AppStateContextProps => {
  return useContext(AppStateContext)
}
