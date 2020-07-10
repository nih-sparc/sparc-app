import { mount } from '@vue/test-utils'
import MarkdownTest from './MarkdownTest'

describe('MarkdownTest', () => {
  const wrapper = mount(MarkdownTest)

  it('Renders the correct markup', () => {
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('h1').exists()).toBe(true)
  })

  it('Adds target="blank" to links', () => {
    expect(wrapper.find('a').element.getAttribute('target')).toBe('_blank')
  })
})
