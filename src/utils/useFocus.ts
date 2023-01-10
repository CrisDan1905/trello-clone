import React, { useEffect, useRef } from 'react'

export const useFocus = (): React.RefObject<HTMLInputElement> => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return ref
}
