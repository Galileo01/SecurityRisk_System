import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        LevelData: [
            {
                name: '低危',
                color: '#1e90ff',
            },
            {
                name: '一般',
                color: '#ffff00',
            },
            {
                name: '较大',
                color: '#ffa500',
            },
            {
                name: '重大',
                color: '#ff0000',
            },
        ],
        preMapState: JSON.parse(localStorage.getItem('mapState')),
        userInfo: {
            username: '',
            password: '',
            tel: '',
        },
    },
    mutations: {
        getUserInfo(state, payload) {
            for (let prop in payload) {
                state.userInfo[prop] = payload[prop];
            }
        },
        clearUserInfo(state){
            state.userInfo={};
        }
    },
    actions: {},
    modules: {},
    getters: {
        //颜色数组
        LevelColors(state) {
            return state.LevelData.map((item) => item.color);
        },
        LevelTexts(state) {
            return state.LevelData.map((item) => item.name);
        },
    },
});
