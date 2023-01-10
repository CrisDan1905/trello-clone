import { AppState } from './state/appStateReducer'

export const save = async (payload: AppState): Promise<Response> => {
  return await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT as string}/save`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(async response => {
    if (response.ok) {
      return await response.json()
    } else {
      throw new Error('Error while saving the state.')
    }
  })
}

export const load = async (): Promise<AppState> => {
  return await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT as string}/load`).then(async response => {
    if (response.ok) {
      return await (response.json() as Promise<AppState>)
    } else {
      throw new Error('Error while loading the state')
    }
  })
}
