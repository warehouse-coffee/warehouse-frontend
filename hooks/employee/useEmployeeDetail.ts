import { useSuspenseQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants";
import {EmployeeDetailVM} from "@/app/api/web-api-client";

const fetchEmployeeDetail = async (id: string): Promise<EmployeeDetailVM> => {
  const response = await fetch(`${API_ENDPOINTS.GET_EMPLOYEE_DETAIL}?id=${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee details");
  }
  return response.json();
};

export const useEmployeeDetail = (employeeId: string) => {
  return useSuspenseQuery<EmployeeDetailVM>({
    queryKey: ["employeeDetail", employeeId],
    queryFn: () => fetchEmployeeDetail(employeeId),
  });
};