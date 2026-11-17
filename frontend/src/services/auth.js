import config from "../../config/config.js";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static async processUnauthorizesResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setToken(result.accessToken, result.refreshToken);
                    return true;
                }
            }
        }

        this.removeToken();
        location.href = '#/'
        return false;
    }

    static async logout(){
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    Auth.removeToken();
                    localStorage.removeItem(Auth.userInfoKey);
                    return true;
                }
            }
        }
    }

    static setToken(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    static removeToken(accessToken, refreshToken) {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static setUserInfo(info) {
         localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static getUserInfo() {
        const userinfo = localStorage.getItem(this.userInfoKey);
        if (userinfo) {
            return JSON.parse(userinfo);
        }

        return null;
    }
}