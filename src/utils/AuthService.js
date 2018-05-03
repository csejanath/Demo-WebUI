export default class AuthService {
    constructor(domain) {
        //this.domain = domain || 'http://localhost:8090';
        this.domain = domain || '';
        this.fetch = this.fetch.bind(this);
        this.login = this.login.bind(this);
        AuthService.getProfile = AuthService.getProfile.bind(this);
    }

    login(username, password) {

        // let formData = new FormData();
        // formData.append(encodeURIComponent('username'), encodeURIComponent(username));
        // formData.append(encodeURIComponent('password'), encodeURIComponent(password));

        let formBody = [];
        formBody.push(encodeURIComponent('username') + "=" + encodeURIComponent(username));
        formBody.push(encodeURIComponent('password') + "=" + encodeURIComponent(password));

        formBody = formBody.join("&");
        return fetch(`/login`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: 'POST',
            body: formBody,
            credentials: 'same-origin',
            withCredentials: true,
        })
        .then(response => {
            if (response.status != 401) {
              response.json().then(json => {
                // console.log(json);
                // console.log(json.username);
                // window.location = "/dashboard";
                localStorage.setItem('username', json.username);
                AuthService.setToken('123');
              });

            } else {
                console.log("Got 401");
                alert("Login failed");
            }
        });

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