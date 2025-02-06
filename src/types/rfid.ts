import { User } from "./user";

export type Rfid = {
    uuid: string;
    created_at: string;
    updated_at: string;
    rfidTag: string;
    isSystem: boolean;
    user?: User | null;
    metadata: { [key: string]: any } | null;
};

