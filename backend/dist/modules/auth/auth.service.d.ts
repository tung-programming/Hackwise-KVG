interface OAuthState {
    field?: string;
    type?: string;
    redirectUrl?: string;
    codeVerifier?: string;
}
interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
interface UserData {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
    field: string | null;
    type: string | null;
    auth_provider: string;
    auth_provider_id: string;
}
export declare const authService: {
    getGoogleAuthUrl: (state: OAuthState) => string;
    getGithubAuthUrl: (state: OAuthState) => string;
    getOAuthState: (stateId: string) => OAuthState | undefined;
    consumeOAuthState: (stateId: string) => OAuthState | undefined;
    handleOAuthCallback: (code: string, stateId: string, provider: "google" | "github") => Promise<{
        user: UserData;
        tokens: TokenPair;
        redirectUrl: string;
    }>;
    generateTokens: (userId: string, email: string) => TokenPair;
    refreshAccessToken: (refreshToken: string) => Promise<TokenPair>;
    getCurrentUser: (userId: string) => Promise<{
        id: any;
        email: any;
        username: any;
        avatar_url: any;
        field: any;
        type: any;
        xp: any;
        streak: any;
        leaderboard_pos: any;
        resume_score: any;
        created_at: any;
    }>;
    logout: (accessToken?: string) => Promise<void>;
    verifyAccessToken: (token: string) => {
        userId: string;
        email: string;
    };
};
export {};
//# sourceMappingURL=auth.service.d.ts.map