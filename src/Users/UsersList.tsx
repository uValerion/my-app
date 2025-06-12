import React from "react";
import { User, UserListProps, UsersApiListURL } from "./UsersModel";
import styled from "styled-components";

function UsersList(props: UserListProps) {
    const { companyId, onUserCreateClicked } = props;

    const [users, setUsers] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetch (`${UsersApiListURL}?companyId=${companyId}`)
            .then(response => response.json())
            .then((responseData) => {
                if (responseData && Array.isArray(responseData)) {
                    setUsers(responseData as User[]);
                } else {
                    console.error("Invalid response data:", responseData);
                }
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            })
            .finally(() => setIsLoading(false))
    },[]);


  return (
    <div>
      <h1>Users List for company {}</h1>
      {isLoading ? <p>Loading...</p> :
        <>
            <ul>
                {
                    users.map((user) => (
                        <UserLine key={user.id}>
                            {user.firstName} {user.lastName} - {user.email}
                        </UserLine>
                    ))
                }
            </ul>
            <button onClick={onUserCreateClicked}>Create User</button>
        </>
    }
    </div>
  );
}

export default UsersList;

const UserLine = styled.li`
padding: 10px 0;
border-bottom: 1px solid #e0e0e0;
font-size: 1rem;
color: #333;
transition: background 0.2s;

&:hover {
    background: #f5f5f5;
}
`