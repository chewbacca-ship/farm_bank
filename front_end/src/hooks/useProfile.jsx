import { useQuery } from "@tanstack/react-query";
import {auth } from '../api/Api'

const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await auth.getProfile();
            if (!response.success) throw new Error(response.error);
            return response.data;

        },
        staleTime: 5 * 60 * 1000,})
}

export default useProfile;

// This is a custom hook for fetching and managing user profile data using React Query.
