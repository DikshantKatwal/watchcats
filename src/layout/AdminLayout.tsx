import { Navigate, Outlet } from 'react-router-dom';
import { SidebarProvider } from '../context/sidebar/SidebarProvider';
import Sidebar from '../components/sidebar';
import TopBar from '../components/topbar';
import { useAuth } from '../context/authcontext/useAuthContext';


const AdminLayout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) {
        // Waiting for the silent refresh to resolve — avoid a flash redirect
        return null // or a spinner: <FullPageSpinner />
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    return (
        <SidebarProvider>
            <div className="p-2 min-h-screen grid grid-rows-[auto_1fr] gap-2">
                <TopBar />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}


export default AdminLayout;
