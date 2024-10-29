export type User = {
  id?: string | undefined;
  companyId?: string | undefined;
  userName?: string | undefined;
  email?: string | undefined;
  phoneNumber?: string | undefined;
  roleName?: string | undefined;
  isActived?: boolean;
  avatarImage?: string | undefined;
  storages?: Storage[] | undefined;
}

export type UserDetail = (User & {
  name: string
  phone: string
  companyId: string
  companyPhone: string
  companyEmail: string
  companyName: string
  companyAddress: string
  storages: Storage[]
}) | null
