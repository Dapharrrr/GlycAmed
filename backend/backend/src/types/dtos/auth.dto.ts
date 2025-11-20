export interface RegisterDto {
    name: string;
    firstname: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface UpdateUserDto {
    name?: string;
    firstname?: string;
    email?: string;
    password?: string;
    currentPassword?: string;
}