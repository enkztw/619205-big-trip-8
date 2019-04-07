import {AdapterEvent} from './adapter-event';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

const API = class {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: `points`})
    .then(toJSON)
    .then(AdapterEvent.parseEvents);
  }

  getServer() {
    return this._load({url: `points`})
    .then(toJSON)
    .then((server) => console.log(server));
  }

  createEvent({event}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(toJSON)
    .then(AdapterEvent.parseEvent);
  }

  updateEvent({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(toJSON)
    .then(AdapterEvent.parseEvent);
  }

  deleteEvent({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  getDestinations() {
    return this._load({url: `destinations`})
    .then(toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
    .then(toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
        .then(checkStatus)
        .catch((err) => {
          console.error(`fetch error: ${err}`);
          throw err;
        });
  }
};

export {API};