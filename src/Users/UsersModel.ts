export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    // createdAt: Date;
    companyId: string;
}

export interface UserBladeProps {
    companyId: string;
}

export interface UserListProps extends UserBladeProps {
    onUserCreateClicked: () => void;
}

export interface UserCreateProps extends UserBladeProps {
    onUserCreated: (user: User) => void;
}

export const UsersApiBaseURL = "http://localhost:3001/";
export const UsersApiListURL = UsersApiBaseURL + "users/";