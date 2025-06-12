import React from "react";
import { User, UserCreateProps, UsersApiListURL } from "./UsersModel";
import styled from "styled-components";


function isNameValid(name: string): boolean  {
    return /^[a-zA-Z\s'-]+$/.test(name.trim()) && name.trim().length >= 2;
};

function isEmailFormatValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function isNewPasswordValid(password: string): boolean {
    return password.length >= 6 && password.length <= 32;
}


function CreateUserForm(props: UserCreateProps) {
    const { companyId, onUserCreated } = props;
    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    // const [emailCopy, setEmailCopy] = React.useState<string>("");
    // const [passwordCopy, setPasswordCopy] = React.useState<string>("");

    const [isFirstNameValid, setIsFirstNameValid] = React.useState<boolean>(false);
    const [isLastNameValid, setIsLastNameValid] = React.useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = React.useState<boolean>(false);
    const [isPasswordValid, setIsPasswordValid] = React.useState<boolean>(false);

    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    // const handlePasswordCopyChange = React.useCallback((passwordCopy: string) => {

    //     //verify Same as password
    //     setPasswordCopy(passwordCopy);
    // }, [passwordCopy, password]);


    const handlePasswordChange = React.useCallback((password: string) => {
        setPassword(password);
        setIsPasswordValid(isNewPasswordValid(password));
        // Verify if password is strong enough
    }, []);

    const handleEmailChange = React.useCallback((newEmail: string) => {
        console.log("handleEmailChange", newEmail);
        setIsEmailValid(false);
        setEmail(newEmail);

        if (isEmailFormatValid(newEmail)) {
            console.log("Email format is valid");
            // Check if email exists in backend
            fetch(`${UsersApiListURL}/?email=${newEmail}&companyId=${companyId}`)
                .then(async (res) => {
                    console.log("Email validation response", res);
                    if (res.ok) {
                        // User exists, so email is not valid for creation
                        setIsEmailValid(false);
                        setErrorMessage("A user with this email already exists.");
                    } else if (res.status === 404) {
                        // User does not exist, email is valid
                        setIsEmailValid(true);
                        setErrorMessage("");
                    } else {
                        setIsEmailValid(false);
                        setErrorMessage("Failed to validate email.");
                    }
                })
                .catch(() => {
                    setIsEmailValid(false);
                    setErrorMessage("Failed to validate email.");
                });
        }
        // Verify if email is valid
    }, [companyId]);


    const handleFirstNameChange = React.useCallback((_firstName: string) => {
        setFirstName(_firstName);
        setIsFirstNameValid(isNameValid(_firstName));
        
        // Verify if first name is valid
    }, []);
    
    const handleLastNameChange = React.useCallback((_lastName: string) => {
        setLastName(_lastName);
        setIsLastNameValid(isNameValid(_lastName));
        // Verify if last name is valid
    }, []);

    const handleSubmit = React.useCallback(() => {
        setIsLoading(true);
        setIsSaving(true); 
        setErrorMessage("");

        fetch(`/api/companies/${companyId}/users`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                companyId
            })
        })
        .then(async (response) => {
            await response.json()
                .then((responseData) => {
                    if (!response.ok) {
                        const error = responseData.text();
                        
                        setErrorMessage(error || "Failed to create user.");
                        
                        return;
                    }
                    
                    setTimeout(() => {
                        onUserCreated(responseData.user as User)
                    }, 2000); //wait 2 seconds to show success message
                    
                })
        })
        .catch((error) => {
            setErrorMessage(error.message || "Failed to create user.");
            setIsLoading(false); // important to set loading to false in case of error
        })
        .finally(() => {
            setIsSaving(false);
        });
    }, [companyId, firstName, lastName, email, password, onUserCreated]);

    const isSubmitDisabled = React.useMemo(() => {
        console.log("checking isSubmitDisabled", {
            isFirstNameValid,
            isLastNameValid,
            isEmailValid,
            isPasswordValid,
        })

        return !(isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid) || isSaving;
    }, [isFirstNameValid, isLastNameValid, isEmailValid, isPasswordValid, isSaving]);

    return (
        <>
            <h2>Create User</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: 320 }}>
                <StyledInput disabled={isSaving} type="text" placeholder="First Name" value={firstName} onChange={(e) => handleFirstNameChange(e.target.value)} />
                <StyledInput disabled={isSaving} type="text" placeholder="Last Name" value={lastName} onChange={(e) => handleLastNameChange(e.target.value)} />
                <StyledInput disabled={isSaving} type="email" placeholder="Email" value={email} onChange={(e) => handleEmailChange(e.target.value)} />
                <StyledInput disabled={isSaving} type="password" placeholder="Password" value={password} onChange={(e) => handlePasswordChange(e.target.value)} />
            </div>
            {/* <input type="email" placeholder="Confirm Email" value={emailCopy} onChange={(e) => setEmailCopy(e.target.value)} /> */}
            {/* <input type="password" placeholder="Confirm Password" value={passwordCopy} onChange={(e) => setPasswordCopy(e.target.value)} /> */}
            <button disabled={isSubmitDisabled} onClick={handleSubmit}>Submit</button>

            {
                isLoading ?
                    isSaving ? 
                        <h3>Saving...</h3> :
                    errorMessage ?
                        <h3 style={{ color: "red" }}>{errorMessage}</h3> :
                    <h3 style={{ color: "green" }}>User created successfully! closing form in 2 seconds</h3>
                : null
            }
        </>
    )
}

export default CreateUserForm;

const StyledInput = styled.input`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;

    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;