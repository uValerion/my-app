// import CreateUserForm from './Users/CreateUser';
import React from 'react';
import UsersList from './UsersList';
import { UserBladeProps } from './UsersModel';
import CreateUserForm from './CreateUser';

function UserBlade(props: UserBladeProps) {
    const { companyId } = props;
    const [isCreateUserFormVisible, setIsCreateUserFormVisible] = React.useState<boolean>(false);

    const handleCreateUserClicked = () => {
        console.log("Create User button clicked");
        setIsCreateUserFormVisible(true);
    }

    const handleUserCreated = () => {
        console.log("user Saved successfully");
        setIsCreateUserFormVisible(false);
        // Optionally, you can refresh the user list here or perform any other action needed after user creation
    }

    return (
        < >
            {
                isCreateUserFormVisible ? 
                <CreateUserForm companyId={companyId} onUserCreated={handleUserCreated} /> :
                <UsersList onUserCreateClicked={handleCreateUserClicked} companyId={companyId} />
            }
        </>
    );
}

export default UserBlade;
