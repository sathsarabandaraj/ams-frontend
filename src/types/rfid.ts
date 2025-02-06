import { User } from "./user";

export type Rfid = {
    uuid: string;
    created_at: string;
    updated_at: string;
    rfidTag: string;
    isSystem: boolean;
    user?: {
        uuid: string;
        firstName: string;
        lastName: string;
        userType: string;
    } | null;
    metadata: { [key: string]: any } | null;
};

