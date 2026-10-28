import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch (err) {
      console.error(`Données corrompues pour "${key}"`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(`Impossible de sauvegarder "${key}"`, err)
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
