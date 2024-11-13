import { useSuspenseQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/constants";
import { EmployeeDetail } from "@/types";

const fetchEmployeeDetail = async (id: string): Promise<EmployeeDetail> => {
  const response = await fetch(`${API_ENDPOINTS.GET_EMPLOYEE_DETAIL}?id=${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee details");
  }
  return response.json();
};

export const useEmployeeDetail = (employeeId: string) => {
  return useSuspenseQuery<EmployeeDetail>({
    queryKey: ["employeeDetail", employeeId],
    queryFn: () => fetchEmployeeDetail(employeeId),
  });
};