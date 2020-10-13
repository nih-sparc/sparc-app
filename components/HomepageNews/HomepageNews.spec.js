import { shallowMount } from '@vue/test-utils'
import HomepageNews from './HomepageNews.vue'
import news from './mockNews'

describe('HomepageNews.vue', () => {
  it('filters only future news or news without a date', () => {
    const wrapper = shallowMount(HomepageNews, {
      propsData: {
        news
      },
      stubs: {
        NuxtLink: true,
        SvgIcon: true,
        ElButton: true
      }
    })

    expect(wrapper.vm.news.length).toBe(4)
    expect(wrapper.vm.upcomingNews.length).toBe(2)
  })
})
