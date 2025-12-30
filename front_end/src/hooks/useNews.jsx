import { useQuery } from "@tanstack/react-query";
import { dataBase } from "../api/Api";

const useNews = () => {
    return useQuery({
        queryKey: ["news"],
        queryFn: async () => {
            const {data} = await dataBase.fetchNews()
            return data
        }
    })
}

export default useNews