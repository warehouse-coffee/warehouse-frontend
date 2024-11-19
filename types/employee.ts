export type Employee = {
  id?: string | null;
  userName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  isActived?: boolean ;
  avatarImage?: string | null;
};
export type EmployeeDetail = Employee & {
  companyPhone: string
  companyEmail: string
  companyName: string
  companyAddress: string
  storages: Storage[]
} | null;