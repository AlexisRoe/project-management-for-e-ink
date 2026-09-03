import { useEffect, useRef, useState } from 'react'

export function useDebouncedInput(initialValue: string, onChange: (value: string) => void, delayMs = 300) {
  const [value, setValue] = useState(initialValue)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const timeoutId = setTimeout(() => onChangeRef.current(value), delayMs)
    return () => clearTimeout(timeoutId)
  }, [value, delayMs])

  return [value, setValue] as const
}
