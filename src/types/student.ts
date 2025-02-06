import { AccoutStatus, Gender, UserType } from "@/enum";

export type Student = {
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
    gender: Gender;
    dob: string;
    accountStatus: AccoutStatus;
    userType: UserType;
    student: {
        uuid: string;
        created_at: string;
        updated_at: string;
        grade: string;
        emergencyContact: {
            name: string;
            relationship: string;
            contactNo: string;
            email: string;
        };
        guardian: {
            name: string;
            relationship: string;
            contactNo: string;
            email: string;
        };
    };
};
