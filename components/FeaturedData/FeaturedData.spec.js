import { shallow } from '@vue/test-utils'
import FeaturedData from './FeaturedData.vue'

import MockData from './mock-featured-data'

describe('FeaturedData.vue', () => {
  let cmp

  beforeEach(() => {
    cmp = shallow(FeaturedData, {
      stubs: {
        NuxtLink: true,
        ElButton: true
      }
    })
  })

  it('Should only show 6 items and a View more button', async () => {
    await cmp.setProps({ featuredData: MockData })
    expect(cmp.findAll('.featured-data__item').length).toBe(6)
    expect(cmp.find('.btn-view-more').exists()).toBe(true)
  })

  it('Should only show 4 items and no View more button', async () => {
    const data = MockData.slice(0, 4)
    await cmp.setProps({ featuredData: data })
    expect(cmp.findAll('.featured-data__item').length).toBe(4)
    expect(cmp.find('.btn-view-more').exists()).toBe(false)
  })

  it('Should should all 8 items and no View more button', async () => {
    await cmp.setProps({ featuredData: MockData })
    await cmp.setData({ viewMore: true })
    expect(cmp.findAll('.featured-data__item').length).toBe(8)
    expect(cmp.find('.btn-view-more').exists()).toBe(false)
  })
})
