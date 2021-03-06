import Vue from 'vue'
import App from './App.vue'
import {
  Container,
  Header,
  Main,
  Table,
  TableColumn,
  Card,
  Row,
  Col,
  Switch,
  Button,
  Dialog,
  InputNumber,
  Form,
  FormItem,
  Input,
  Tooltip
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false 

Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Switch);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(InputNumber);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Tooltip);

new Vue({
  render: h => h(App),
}).$mount('#app')
