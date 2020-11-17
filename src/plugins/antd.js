//按需加载    并全局注册组件
import Vue from 'vue'
import {
    message,
    Button,
    Spin,
    Input,
    FormModel,
    DatePicker,
    Icon,
    Row,
    Col,
    Modal,
    Drawer,
    Layout,
    Alert
} from "ant-design-vue";

Vue.use(Button);
Vue.use(Spin);
Vue.use(Input)
Vue.use(FormModel)
Vue.use(DatePicker)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Modal)
Vue.use(Drawer)
Vue.use(Layout)
Vue.use(Alert)
Vue.prototype.$message = message;
// Vue.prototype.$confirm = MessageBox.confirm;

