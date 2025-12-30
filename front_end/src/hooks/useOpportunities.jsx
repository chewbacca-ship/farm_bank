import { useQuery } from "@tanstack/react-query";
import { dataBase } from "../api/Api";


const useOpportunities = () => {
    return useQuery({
        queryKey: ["opportunities"],
        queryFn: async () => {
            const {data} = await dataBase.fetchOpportunities()
            return data
        }
    })
}

export default useOpportunities