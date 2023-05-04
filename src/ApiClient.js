export default async function(method, url, query, body, customHeaders){
    let response;
    let headers = customHeaders ? {} : {'Content-Type':'application/json'};
    if(localStorage.getItem('accessToken')){
        headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
    }
    try{
        response = await fetch(url, {
            method: method,
            headers: headers,
            body: (body && !customHeaders ) ? JSON.stringify(body) : body,
        })
    } catch(error){
        response = {
            ok: false,
            status: 500,
            json: async () => { return {
                code: 500,
                message: 'The server is unresponsive',
                description: error.toString(),
            }; }
        };
    }
    return {
        ok: response.ok,
        status: response.status,
        json: response.status!==204 ? await response.json() : null
    };
};