import { useEffect, useRef, useState } from 'react'

/**
 * Manages a piece of local input state that updates immediately for the UI,
 * but only calls `onChange` after the user has stopped typing for `delayMs`.
 *
 * Intended for text inputs bound to a slow persistence layer (e.g. IndexedDB
 * writes on every keystroke), where debouncing avoids excessive writes while
 * keeping the input itself fully responsive.
 *
 * @param initialValue - Value to seed local state with on mount.
 * @param onChange - Called with the latest value `delayMs` after the last edit.
 *   Always the newest reference is used, so it's safe to pass an inline function.
 * @param delayMs - Debounce delay in milliseconds. Defaults to 300.
 * @returns A `[value, setValue]` tuple, mirroring `useState`: `value` is the
 *   current local (unde-bounced) value, `setValue` updates it and restarts the timer.
 *
 * @example
 * ```tsx
 * function TitleField({ item, onSave }: { item: ProjectItem; onSave: (title: string) => void }) {
 *   const [title, setTitle] = useDebouncedInput(item.title, onSave)
 *   return <input value={title} onChange={(e) => setTitle(e.target.value)} />
 * }
 * ```
 */
export function useDebouncedInput(initialValue: string, onChange: (value: string) => void, delayMs = 300) {
  const [value, setValue] = useState(initialValue);

  // Keep the latest onChange without re-triggering the debounce effect.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    // Restart the timer on every value change; only the last one fires.
    const timeoutId = setTimeout(() => onChangeRef.current(value), delayMs);

    return () => clearTimeout(timeoutId);
  }, [value, delayMs])

  return [value, setValue] as const
}
