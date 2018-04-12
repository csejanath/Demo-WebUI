export default class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://13.229.127.31:8181';
        this.fetch = this.fetch.bind(this);
        this.login = this.login.bind(this);
        AuthService.getProfile = AuthService.getProfile.bind(this);
    }

    login(email, password) {

        AuthService.setToken('123');
        AuthService.setProfile({
            "firstname":"firstname",
            "lastname":"lastname"
        });
        return true;

        // Get a token
        // AuthService.setToken(authData.id_token);
        // AuthService.setProfile(authData.profile);
        // return fetch(`public/manifest.json`)
        //     .then(function(response) {
        //         return response.json()
        //     })
        //     .then(authData=> {
        //         AuthService.setToken('123');
        //         AuthService.setProfile({
        //             "firstname":"firstname",
        //             "lastname":"lastname"
        //         });
        //         return authData;
        //     });
        // this.fetch(`${this.domain}/login`, {
        //     method: 'POST',
        //     body: JSON.stringify({"username":"John","password":"1234"})
        // }).then(res => {
        //     AuthService.setToken(res.id_token);
        //     return this.fetch(`${this.domain}/user`, {
        //         method: 'GET'
        //     })
        // }).then(res => {
        //     AuthService.setProfile(res);
        //     return Promise.resolve(res);
        // })
    }

    loggedIn(){
        // Checks if there is a saved token and it's still valid
        const token = AuthService.getToken();
        return !!token // handwaiving here
    }

    static setProfile(profile){
        // Saves profile data to localStorage
        localStorage.setItem('profile', JSON.stringify(profile));
    }

    static getProfile(){
        // Retrieves the profile data from localStorage
        const profile = localStorage.getItem('profile');
        return profile ? JSON.parse(localStorage.profile) : {}
    }

    static setToken(idToken){
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
    }

    static getToken(){
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    logout(){
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            const error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    }

    fetch(url, options){
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.loggedIn()){
            headers['Authorization'] = 'Bearer ' + AuthService.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(AuthService._checkStatus)
            .then(response => response.json())
    }
}