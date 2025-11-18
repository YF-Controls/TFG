export interface UpdateUserDto{
  email?: string;
  fullname?: string;
  roles?: string[];
  isActive?: boolean;
}