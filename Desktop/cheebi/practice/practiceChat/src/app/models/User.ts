
export class User{
  id!: number;
  firstname!: string;
  lastname!: string;
  email!: string;
  password!: string;
  role!: UserRole;
  status !:string;
}
export class UserInformation {
  firstname!: string;
  lastname!: string;
  email!: string;
  countryCode!: string;
  phone!: string;
  aboutme!: string;  // Add more fields based on your query
  gender!: string;
  address!: string;
  city!: string;
  codePostal!: string;
  country!: string;
  dateBirth!: string;
  coverPhoto!: string;  // Assuming it's a string; adjust as needed
  preferences!: string;
  role!: string;  // Adjust if UserRole is an Enum
}
enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
}
export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken:string;

}


export interface Country {
  countryNameEn: string;
  countryCallingCode: string;

}
