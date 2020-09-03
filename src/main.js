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

new Vue({
  render: h => h(App),
}).$mount('#app')
