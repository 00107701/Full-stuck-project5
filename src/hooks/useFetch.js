import { useState, useEffect, useRef } from 'react'

/**
 * useFetch – generic data-fetching hook with a simple in-memory cache.
 *
 * Cache challenge implementation:
 *   cacheRef holds a plain object { [url]: data }.
 *   Before every fetch we check if the url is already cached.
 *   If it is, we return the cached data immediately (no network request).
 *
 * @param {string} url - The endpoint to fetch from.
 * @returns {{ data, loading, error, refetch }}
 */
export function useFetch(url) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // cacheRef persists across renders but does NOT cause re-renders when changed
  const cacheRef = useRef({})

  async function fetchData() {
    if (!url) return

    // Return cached result if available
    if (cacheRef.current[url]) {
      setData(cacheRef.current[url])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
      const json = await res.json()
      cacheRef.current[url] = json   // store in cache
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [url])

  return { data, loading, error, refetch: fetchData }
}