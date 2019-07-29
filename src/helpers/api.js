const api = {
    callApi: async function(api,param) {
        let response = await fetch(api + param);
        return await response.json();
    }
}

export default api;