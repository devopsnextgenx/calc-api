import React, { useEffect, useState } from 'react';
import './Home.css';

// Utility: Generate random state
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

const clientId = '20eba3233abd67b6c5c4'; // Replace with your client ID
const clientSecret = '24cab6de5afba5efcdc27b0d4bbfedaaed652a43'; // WARNING: Never expose client secret in production frontend
const returnUrl = 'http://localhost:5000/redirectUrl'; // Replace with your redirect URL

// Start OAuth2.0 flow (no PKCE for GitHub OAuth apps)
async function startOAuthFlow() {
    const redirectUri = encodeURIComponent(returnUrl);
    const state = generateState();
    sessionStorage.setItem('oauth_state', state);
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&clientSecret=${clientSecret}&state=${state}&redirect_uri=${redirectUri}&scope=read:user`;
    await window.electron.openOAuthWindow(authUrl);
}

const Home: React.FC = () => {
    const [accessCode, setAccessCode] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        window.electron.getLatestAccessCode().then(code => {
            if (code) setAccessCode(code);
        });

        const handler = async (_event: any, code: string) => {
            setAccessCode(code);
            // Exchange code for token (GitHub returns URL-encoded string)
            console.log('Received OAuth code:', code);
            const body = new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret, // WARNING: Never expose in production
                code,
                redirect_uri: returnUrl
            });
            try {
                const response = await fetch('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json', // Ask for JSON, fallback to URL-encoded if needed
                    },
                    body: body.toString(),
                });
                let data;
                try {
                    data = await response.json();
                } catch {
                    // fallback: parse as URL-encoded
                    const text = await response.text();
                    data = Object.fromEntries(new URLSearchParams(text));
                }
                if (data.error) {
                    setTokenError(data.error_description || data.error);
                    setAccessToken(null);
                } else {
                    setAccessToken(data.access_token || null);
                    setTokenError(null);
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

    return (
        <div className="about-container">
            <h1>Home</h1>
            {tokenError && <div style={{color: 'red'}}>{tokenError}</div>}
            {accessToken ? (
                <div>
                    <p><strong>Access Token:</strong> {accessToken}</p>
                    <button className="btn btn-secondary" onClick={async () => {
                        if (!accessToken) return;
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
                    }}>Get User Information</button>
                    <div id="user">
                        {userInfo && (
                            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
                        )}
                    </div>
                </div>
            ) : accessCode ? (
                <div>
                    <p>Access Code: {accessCode}</p>
                </div>
            ) : (
                <button className="btn btn-primary" onClick={startOAuthFlow}>Login with GitHub</button>
            )}
        </div>
    );
};

export default Home;