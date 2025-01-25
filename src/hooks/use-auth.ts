import { useEffect } from 'react';
import {usePathname, useRouter} from 'next/navigation';
import { useCookies } from 'react-cookie';

const useAuth = () => {
    const [cookies] = useCookies(['auth_token']);
    const router = useRouter();
    const currentPath = usePathname();

    useEffect(() => {
        // Check if the user is on the login or verifyotp pages
        if (!cookies.auth_token && currentPath !== '/auth/login' && currentPath !== '/auth/otp-verification') {
            router.push('/auth/login'); // Redirect to login page if no auth token
        }
    }, [cookies.auth_token, currentPath, router]);
};

export default useAuth;
