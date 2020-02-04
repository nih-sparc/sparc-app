import Vue, { ComponentOptions } from "vue";
import { Store } from "vuex";
import { Route } from 'vue-router';

declare module "*.vue" {
  export default Vue
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    asyncData?: (store: Store<any>, route: Route) => Promise<any>;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    asyncData?: (store: Store<any>, route: Route) => Promise<any>;
  }
}