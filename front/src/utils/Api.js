export class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    getElements() {
    //загрузили все элементы
        return fetch(this._url, {
            method: "GET",
            headers: this._headers,
        }).then((res) => this._getResponseData(res));
    }

    addElement(data) {
        //добавили элемент
        return fetch(this._url, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                date: data.date,
                quantity: data.quantity,
                distance: data.distance,
            }),
        }).then((res) => this._getResponseData(res));
    }

    removeElement(id) {
        //удалили элемент
        return fetch(`${this._url}${id}`, {
            method: "DELETE",
            headers: this._headers,
        }).then((res) => this._getResponseData(res));
    }

    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.message}`);
        }
        return res.json();
    }
}
const config = {
    url: "http://localhost:3001/",
    headers: {
        "Content-Type": "application/json",
    },
};

const api = new Api(config);

export default api;