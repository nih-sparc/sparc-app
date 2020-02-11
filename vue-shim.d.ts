import Vue, { ComponentOptions } from "vue";
import { Store } from "vuex";

declare module "*.vue" {
  export default Vue
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue, Data> {
    asyncData?: (store: Store<any>, route: Route) => Promise<Data>;
  }
}

declare module "vue/types/vue" {
  interface Vue<Data> {
    asyncData?: (store: Store<any>, route: Route) => Promise<Data>;
  }
}