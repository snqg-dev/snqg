import service from './http'
import md5 from 'crypto-js/md5'

export default class ApiUtil {
    static async get(url: string, data: any) {
      let res;
        if (data == null) {
            res = await service.get(url);
        }
        else{
          let authedString = this.getAuthedString(data);
          res = await service.get(url + "?" + authedString);
        }
        return res;
    }

    static post(url: string, data: any) {
        if (data == null) {
            return service.get(url);
        }
        const authedString = this.getAuthedString(data);
        return service.post(url, authedString);
    }

    static getAuthedString(data: any) {
        const property: string[] = Object.getOwnPropertyNames(data).filter(prop => data[prop] === null);
        let query: Array<String> = [];
        for(const prop in property) {
            query.push(prop + "=" + encodeURIComponent(data[prop]));
        }
        let queryString = query.join("&");
        return this.getAuthToken(queryString);
    }

    static getAuthToken(data: string): string {
        let currentTime: number = new Date().valueOf() / 1000;
        let dataString = (currentTime % 100) + md5(currentTime + data).toString();
        return data + "&auth=" + dataString.toString();
    }
}