import type { User } from '@prisma/client';
export default class AuthService {
    register: (userData: any) => Promise<Omit<User, "hashed_password">>;
    login: (loginData: any) => Promise<{
        accessToken: string;
        refreshToken: string;
    } | null>;
    refresh: (refreshTokenString: string) => Promise<{
        accessToken: string;
        refreshToken: string;
    } | null>;
}
//# sourceMappingURL=auth.service.d.ts.map