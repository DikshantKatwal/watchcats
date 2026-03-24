import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
type Todo = {
    text: string
}

const Home = () => {
    const queryClient = useQueryClient()
    const { data, isLoading, error } = useQuery<Todo>({
        queryKey: ['test'],
        queryFn: async () => {
            const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random')
            return res.json()
        },
        staleTime: 1000 * 60 * 5,
    })
    if (isLoading) return <div>Loading...</div>
    const refreshFact = () => {
        queryClient.invalidateQueries({ queryKey: ['test'] })
    }

    if (error) return <div>Error loading data</div>
    return (
        <div>
            {data?.text}
            <button onClick={refreshFact}>Refresh Fact</button>
            <Link to={'/about'}>About us</Link>
        </div>
    )
}

export default Home