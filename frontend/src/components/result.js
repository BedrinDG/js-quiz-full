import {urlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result {

    constructor() {
        this.testId = sessionStorage.getItem('id')

        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = "#/";
        }

        if (this.testId) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result?userId=' + userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }

                    document.getElementById('result-score').innerText = result.score + '/' + result.total;
                    return true;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = "#/";
    }
}