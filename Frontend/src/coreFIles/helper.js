import axios from 'axios';
import Cookies from 'js-cookie';
import config from './config';

const loginData = Cookies.get('Code_Maya_Assignment') ? JSON.parse(Cookies.get('Code_Maya_Assignment')) : null;
const serverPath = config.API_URL;


export const request = async (path, data, method) => {
    try {
        let tokenData = Cookies.get('Code_Maya_Assignment')
            ? JSON.parse(Cookies.get('Code_Maya_Assignment'))
            : null;

        const axiosOptions = {
            method,
            url: `${serverPath}/${path}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: tokenData ? `Bearer ${tokenData.accessToken}` : "",
            },
        };

        if (method === "GET") {
            axiosOptions.params = data;
        } else {
            axiosOptions.data = data;
        }

        const response = await axios(axiosOptions);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("Access token expired, refreshing...");

            const stored = Cookies.get("Code_Maya_Assignment")
                ? JSON.parse(Cookies.get("Code_Maya_Assignment"))
                : null;

            if (!stored?.refreshToken) {
                window.location.href = "/login";
                return;
            }

            try {
                const refreshRes = await axios.post(`${serverPath}/auth/refresh-token`, {
                    refreshToken: stored.refreshToken,
                });

                const newData = {
                    ...stored,
                    accessToken: refreshRes.data.accessToken,
                    refreshToken: refreshRes.data.refreshToken,
                };
                Cookies.set("Code_Maya_Assignment", JSON.stringify(newData));

                return request(path, data, method);

            } catch (refreshErr) {
                Cookies.remove("Code_Maya_Assignment");
                window.location.href = "/login";
                return;
            }
        }

        throw error;
    }
};


export const requestFormData = (path, data, method) => {
    var form_data = new FormData();
    for (var key in data) {
        form_data.append(key, data[key]);
    }
    
    var options = {
        method: method,
        url: `${serverPath}/${path}`,
        data: form_data,
        headers: {
            Authorization: loginData ? `Bearer ${loginData?.accessToken}` : ''
        },
    };
    
    let res = axios(options);
    res.then(res1 => { });
    return res;
};

export const postRequest = async (path, data) => await request(path, data, 'POST');
export const PatchRequest = async (path, data) => await request(path, data, 'PATCH');
export const deleteRequest = async (path, data) => await request(path, data, 'DELETE');
export const getRequest = async (path, data) => await request(path, data, 'GET');

