// types.ts
export type Staff = {
    uuid: string;
    created_at: string;
    updated_at: string;
    systemId: string;
    email: string;
    nameInFull: string;
    firstName: string;
    lastName: string;
    address: string;
    contactNo: string;
    gender: string;
    dob: string;
    accountStatus: string;
    userType: string;
    staff: {
        uuid: string;
        created_at: string;
        updated_at: string;
        postalCode: string;
        nicNo: string;
        nicFrontUrl: string;
        nicBackUrl: string;
        civilStatus: string;
        isAdmin: boolean;
        isTeacher: boolean;
        hasApprovedInformation: boolean;
        secondaryContact: {
            name: string;
            relationship: string;
            contactNo: string;
            email: string;
        };
        bankDetails: {
            accountHolderName: string;
            accountNo: string;
            bankName: string;
            branchName: string;
        };
    };
};