import Vue from 'vue';
import {
    message,
    Button,
    Spin,
    Input,
    Row,
    Col,
    Modal,
    Drawer,
    Layout,
    Icon,
    Tooltip,
    Form,
    Select,
    Slider,
    Carousel,
    Card,
    DatePicker,
    TimePicker,
    Table,
    Collapse,
    ConfigProvider,
    Switch,
    Tabs,
    FormModel
} from 'ant-design-vue';

Vue.use(Button);
Vue.use(Spin);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Modal);
Vue.use(Drawer);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(Select);
Vue.use(Slider);
Vue.use(Carousel);
Vue.use(Card);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Table);
Vue.use(Collapse);
Vue.use(ConfigProvider);
Vue.use(Switch);
Vue.use(Tabs);
Vue.use(FormModel);
Vue.prototype.$message = message; //同时挂载到全局和 vue 原型
message.config({
    top: `50%`,
    duration: 5,
    maxCount: 1,
});
window.$message = message;
