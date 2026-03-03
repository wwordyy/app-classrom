


import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { apiGetMe } from '../../api/user'

const ROLE_HOME: Record<string, string> = {
    admin:    '/admin/users',
    observer: '/observer/main',
    teacher:  '/teacher/main',
    student:  '/student/posts',
}


export function RoleRedirect() {
    const [to, setTo] = useState<string | null>(null)

    useEffect(() => {
        apiGetMe()
        .then(user => {
            const role = user.role?.title ?? ''
            setTo(ROLE_HOME[role] ?? '/login')
        })
        .catch(() => setTo('/login'))
    }, [])

    if (!to) return null 

    return <Navigate to={to} replace />
}


export function ProtectedRoute({
    children,
    allowedRoles,
    }: {
    children: React.ReactNode
    allowedRoles: string[]
    }) {

        
    const [status, setStatus] = useState<'loading' | 'ok' | 'forbidden' | 'unauth'>('loading')
    const [home, setHome] = useState('/login')

    useEffect(() => {
        apiGetMe()
        .then(user => {
            const role = user.role?.title ?? ''
            setHome(ROLE_HOME[role] ?? '/login')
            setStatus(allowedRoles.includes(role) ? 'ok' : 'forbidden')
            localStorage.setItem('userFullName', user.fullName);
        })
        .catch(() => setStatus('unauth'))
    }, [])

    if (status === 'loading')   return null
    if (status === 'unauth')    return <Navigate to="/login" replace />
    if (status === 'forbidden') return <Navigate to={home} replace />
    return <>{children}</>
}