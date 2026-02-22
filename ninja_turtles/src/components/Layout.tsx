import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Оверлей для мобильного */}
            <div
                className={`mobile-overlay ${sidebarOpen ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            <div className="app-main">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
