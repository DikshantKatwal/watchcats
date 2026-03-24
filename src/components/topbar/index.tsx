import { SidebarOpen } from "lucide-react"
import { Button } from "../ui/button"
import { useSidebar } from "../../context/sidebar/useSidebar"
import ThemeToggle from "../../theme/theme-toggle"
import { useQuery } from "@tanstack/react-query"
import { profileApi } from "../../api/profile"
import { Skeleton } from "../ui/skeleton"

const TopBar = () => {
    const { sidebarOpen, setSidebarOpen } = useSidebar()
    const { data, isFetching } = useQuery({ queryKey: ['profile'], queryFn: profileApi.get, refetchOnWindowFocus: false, refetchOnMount: false })
    return (
        <header className="w-full  shadow-sidebar-ring/30 shadow-[0_0_3px_1px] rounded-sm">
            <div className="px-2 flex items-center">
                <div className=" flex items-center  gap-3">
                    <div className="">
                        <Button className="p-0!" variant={"ghost"} onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <SidebarOpen />
                        </Button>
                    </div>
                    <div className="font-oswald font-base flex">
                        Hello {isFetching ? <Skeleton className="h-5 w-30" /> : data?.first_name},
                    </div>
                </div>
                <div className="ml-auto">
                    <ThemeToggle />
                </div>
            </div>

        </header>
    )
}
export default TopBar