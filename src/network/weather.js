//天气查询
import axios from 'axios'
export function getWeather() {
    return axios.get('https://tianqiapi.com/api?version=v6&appid=73981899&appsecret=yVO9XaYJ&cityid=101040200&vue=1')
        .then(res => {
            return {
                success: 1,
                data: res.data
            }
        })
        .catch(err => {
            return {
                success: 0,
                data:err
            }
        })

}
