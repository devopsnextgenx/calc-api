import React, { useEffect, useState } from 'react';
import './Login.css';

function generateState(length = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        result += charset[array[i] % charset.length];
    }
    return result;
}

let clientApp = undefined as any;
window.electron.getClientAppConfig().then(config => {
    clientApp = config;
});

interface LoginProps {
    onTokenChange?: (token: string | null) => void;
}

const Login: React.FC<LoginProps> = ({ onTokenChange }) => {
    const [accessCode, setAccessCode] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

    // Start OAuth2.0 flow
    const startOAuthFlow = async () => {
        const state = generateState();
        sessionStorage.setItem('oauth_state', state);
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientApp.clientId}&client_secret=${clientApp.clientSecret}&state=${state}&redirect_uri=${clientApp.redirectUri}&scope=read:user`;
        await window.electron.openOAuthWindow(authUrl);
    };

    // Logout: clear all state
    const logout = () => {
        setAccessCode(null);
        setAccessToken(null);
        setUserInfo(null);
        setTokenError(null);
        sessionStorage.removeItem('access_token');
    };

    useEffect(() => {
        const storedToken = sessionStorage.getItem('access_token');
        if (storedToken) setAccessToken(storedToken);

        window.electron.getLatestAccessCode().then(code => {
            if (code) setAccessCode(code);
        });

        const handler = async (_event: any, code: string) => {
            setAccessCode(code);
            // Exchange code for token
            const body = new URLSearchParams({
                client_id: clientApp.clientId,
                client_secret: clientApp.clientSecret,
                code,
                redirect_uri: clientApp.redirectUri
            });
            try {
                const response = await fetch('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                    },
                    body: body.toString(),
                });
                let data;
                try {
                    data = await response.json();
                } catch {
                    const text = await response.text();
                    data = Object.fromEntries(new URLSearchParams(text));
                }
                if (data.error) {
                    setTokenError(data.error_description || data.error);
                    setAccessToken(null);
                    sessionStorage.removeItem('access_token');
                } else {
                    setAccessToken(data.access_token || null);
                    setTokenError(null);
                    if (data.access_token) {
                        sessionStorage.setItem('access_token', data.access_token);
                    }
                }
            } catch (err: any) {
                setTokenError('Token exchange failed: ' + err.message);
            }
        };

        window.electron.onOAuthAccessCode(handler);
        return () => {
            window.electron.removeOAuthAccessCode(handler);
        };
    }, []);

    // Fetch user info when accessToken changes
    useEffect(() => {
        if (!accessToken) return;
        const fetchUser = async () => {
            try {
                const response = await fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else {
                    setUserInfo({ error: 'Failed to fetch user info' });
                }
            } catch (err) {
                setUserInfo({ error: 'Error fetching user info' });
            }
        };
        fetchUser();
    }, [accessToken]);

    useEffect(() => {
        if (onTokenChange) onTokenChange(accessToken);
    }, [accessToken, onTokenChange]);

    return (
        <div className="login-container">
            {tokenError && <div style={{color: 'red'}}>{tokenError}</div>}
            {accessToken && userInfo ? (
                <div className="user-info">
                    <img src={userInfo.avatar_url} alt="avatar" style={{width: 40, height: 40, borderRadius: '50%'}} />
                    <span style={{marginLeft: 10}}>{userInfo.login}</span>
                    <button className="btn btn-secondary" style={{marginLeft: 20}} onClick={logout}>Logout</button>
                </div>
            ) : (
                <button className="btn btn-primary" onClick={startOAuthFlow}>Login with GitHub</button>
            )}
        </div>
    );
};

export default Login;