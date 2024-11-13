import { useSuspenseQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants";
import {  Page } from "../../app/api/web-api-client"; 
import { Storage } from "@/types/storage";
interface FetchUserStorageListParams {  
    pageIndex: number;
    pageSize: number;
}

const fetchUserStorageList = async ({ pageIndex, pageSize }: FetchUserStorageListParams): Promise<{ userStorageList: Storage[], page: Page }> => {
    const params = new URLSearchParams({
        pageNumber: (pageIndex + 1).toString(),
        size: pageSize.toString(),
    });
    const response = await fetch(`${API_ENDPOINTS.GET_STORAGE_OF_USER}?${params}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user storage list");
    }

    const data = await response.json();

    if (!data || data.error) {
        throw new Error(data?.error || "No data received");
    }

    return data;
};

export const useUserStorageList = (pageIndex: number, pageSize: number) => {
    return useSuspenseQuery({
        queryKey: ["userStorageList", pageIndex, pageSize],
        queryFn: () => fetchUserStorageList({ pageIndex, pageSize }),
        refetchOnWindowFocus: false,
    });
}