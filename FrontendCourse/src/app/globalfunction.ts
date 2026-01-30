
export const checkApiStatus = async (status: number, refreshWeb: boolean) => {
    if (typeof window === 'undefined') return;

    const provider = localStorage.getItem('provider');
    const decodedEmail = localStorage.getItem('emailUser');

    if (status === 401 && decodedEmail && provider) {
        // Loop Breaker: Check usage count in sessionStorage
        const retryCount = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('retryCount') || '0') : 0;
        if (retryCount > 3) {
            console.error("Too many refresh attempts. Forcing logout.");
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
            return;
        }

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('retryCount', (retryCount + 1).toString());
        }

        const refreshSatus = await refreshToken(decodedEmail, provider);
        if (refreshSatus === 200) {
            console.log("set access moi thanh cong")
            if (refreshWeb == true) {
                window.location.reload();
            }
        } else {
            // If refresh fails, also logout
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
        }
    }
}
const refreshToken = async (email: string, provider: string) => {
    const newRequest = {
        email: email,
        accountFrom: provider,
    };
    const checkedRemember = typeof window !== 'undefined' ? localStorage.getItem('checkRemember') : 'false';
    try {
        const response = await fetch(`http://localhost:8080/apiAuthen/refresh?checkedRemember=${checkedRemember}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    accountFrom: provider,
                    refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
                }),
                credentials: 'include'
            });

        if (response.ok) {
            // Update tokens from response body if available (BackEnd now sends JSON)
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
            return 200; // Success
        }
        return response.status
    } catch (error) {
        console.error('Error:', error);
    }
}
