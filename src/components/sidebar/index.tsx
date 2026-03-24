import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Send
} from "lucide-react"
import { useSidebar } from "../../context/sidebar/useSidebar"
import { Link } from "react-router-dom"
import { useLogout } from "../../hooks/useLogout"

const Sidebar = () => {
    const { sidebarOpen, setSidebarOpen } = useSidebar()
    const menu = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { name: "Users", icon: Users, href: "/admin/user" },
        { name: "Customers", icon: Users, href: "/admin/customer" },
    ]
    const { mutate: logout, isPending } = useLogout()
    return (
        <>
            {/* 🔹 Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/40 md:hidden"
                />
            )}

            {/* 🔹 Sidebar */}
            <aside
                className={`
                    fixed top-0 md:relative z-40 h-full
                    flex flex-col justify-between
                    bg-background
                    shadow-sidebar-ring/30 shadow-[0_0_3px_2px] rounded-[0_5px_5px_0]
                    transition-all duration-300
                    ${sidebarOpen
                        ? "translate-x-[calc(-0%-10px)]"
                        : "translate-x-[calc(-100%-10px)]"
                    }
                        p-1
                       
                    md:translate-x-0
                    ${sidebarOpen ? "w-48" : "md:w-8"}
                    font-nunito
                    overflow-hidden
                    pb-2
                `}
            >
                {/* 🔹 TOP */}
                <div className="flex items-center border-b ">
                    <div className="flex items-center gap-2 h-8">
                        <div className="size-5 rounded-md flex items-center justify-center">
                            <Send />
                        </div>
                        {
                            sidebarOpen && (
                                <span className="font-semibold text-md text-nowrap">Check-In</span>
                            )
                        }
                    </div>
                </div>

                {/* 🔹 MIDDLE */}
                <nav className="flex flex-col flex-1 gap-2 pt-2 ">
                    {menu.map((item, i) => {
                        const Icon = item.icon
                        return (
                            // <div key={i} className="rounded-sm pl-1 grid grid-cols-[auto_1fr] gap-2 items-center  h-6 overflow-hidden hover:cursor-pointer hover:bg-ring/40">
                            <Link to={item.href} key={i} className={`rounded-sm  grid  ${sidebarOpen ? "pl-1 grid-cols-[auto_1fr]" : "grid-cols-[auto] justify-center"} gap-2  items-center  h-6 overflow-hidden hover:cursor-pointer hover:bg-ring/40`}>
                                <div className="">
                                    <Icon className={`size-4`} />
                                </div>
                                {sidebarOpen && (
                                    <div className="text-sm font-semibold">
                                        {item.name}
                                    </div>
                                )}

                            </Link>
                            // <Link
                            //     key={i}
                            //     href={item.href}
                            //     onClick={() => setSidebarOpen(false)}
                            //     className="flex items-center  rounded-md  hover:bg-muted transition"
                            // >
                            //     <div className={`w-full shadow ${item.href === activeSideBar && "shadow-sidebar-ring"} flex items-center gap-2.5  rounded-md w-full py-1.5 `}>
                            //         <LayoutDashboard className={` ${sidebarOpen ? "size-5" : "size-5"}`} />

                            //         <span>{item.name}</span>
                            //     </div>

                            // </Link>
                        )
                    })}
                </nav>
                <div className="flex flex-col gap-1">
                    <div className={`rounded-sm  grid  ${sidebarOpen ? "pl-1 grid-cols-[auto_1fr]" : "grid-cols-[auto] justify-center"} gap-2  items-center  h-6 overflow-hidden hover:cursor-pointer hover:bg-ring/40`}>
                        <div className="">
                            <Settings className="size-4" />
                        </div>
                        {sidebarOpen && (
                            <div className="text-sm font-semibold">
                                Settings
                            </div>
                        )}
                    </div>
                    <div className={`rounded-sm  grid  ${sidebarOpen ? "pl-1 grid-cols-[auto_1fr]" : "grid-cols-[auto] justify-center"} gap-2  items-center  h-6 overflow-hidden hover:cursor-pointer hover:bg-ring/40`}>
                        <div className="">
                            <LogOut className="size-4" />
                        </div>
                        {sidebarOpen && (
                            <div
                                onClick={() => !isPending && logout()}
                                className="text-sm font-semibold cursor-pointer hover:opacity-70 transition-opacity"
                            >
                                {isPending ? "Logging out…" : "Logout"}
                            </div>
                        )}
                    </div>
                </div>
                {/* <div className="border-t p-3">
                    <button className="flex w-full items-center gap-3 rounded-md p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition">
                        <LogOut size={18} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div> */}
            </aside>
        </>
    )
}

export default Sidebar
