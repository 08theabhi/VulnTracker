import { createContext, useContext, useState, useEffect, useRef } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const fetchingRef = useRef(false)
  const mountedRef = useRef(true)

  const fetchNotifications = async () => {
    if (fetchingRef.current) return
    const token = localStorage.getItem('vt_token')
    if (!token) return

    fetchingRef.current = true
    try {
      const res = await fetch('/api/cve/results', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok || !mountedRef.current) return
      const data = await res.json()
      if (!mountedRef.current) return
      const unreadItems = (data || []).filter(c => !c.is_read)
      setNotifications(unreadItems.slice(0, 10))
      setUnread(unreadItems.length)
    } catch { }
    finally { fetchingRef.current = false }
  }

  const markAllRead = async () => {
    const token = localStorage.getItem('vt_token')
    if (!token) return
    try {
      await fetch('/api/cve/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      setUnread(0)
      setNotifications([])
    } catch { }
  }

  useEffect(() => {
    mountedRef.current = true
    // Wait 5s after load, then check every 5 mins
    const delay = setTimeout(() => {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 300000)
      return () => clearInterval(interval)
    }, 5000)
    return () => {
      mountedRef.current = false
      clearTimeout(delay)
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unread, fetchNotifications, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
