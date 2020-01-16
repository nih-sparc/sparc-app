<template>
  <div class="homepage-testimonials">
    <div class="container home-container">
      <h2>Connecting the Datascience Community</h2>
      <div class="homepage-testimonials__testimonial-wrap">
        <div
          v-for="(testimonial, idx) in testimonials"
          :key="testimonial.author"
          class="homepage-testimonials__testimonial"
          :class="{
            'homepage-testimonials__testimonial--active':
              activeTestimonial === idx
          }"
        >
          <p>{{ testimonial.copy }}</p>
          <span>&mdash; {{ testimonial.author }}</span>
        </div>
      </div>

      <div class="homepage-testimonials__anchor-wrap">
        <button
          v-for="(testimonial, idx) in testimonials"
          :key="testimonial.author"
          class="homepage-testimonials__testimonial-anchor"
          :class="{
            'homepage-testimonials__testimonial-anchor--active':
              activeTestimonial === idx
          }"
          @click="activeTestimonial = idx"
        >
          <div class="homepage-testimonials__testimonial-anchor__indicator">
            <span class="visuallyhidden">
              Go to tab for {{ testimonial.author }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomepageTestimonials',

  data: function() {
    return {
      activeTestimonial: 0,
      testimonials: [
        {
          copy:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor as en incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud delo exercitation ullamco laboris nisi ut aliquip ex consequat.',
          author: 'Jeffery Ardell1, UCLA'
        },
        {
          copy:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor as en incididunt ut labore et dolore magna ',
          author: 'Jeffery Ardell2, UCLA'
        },
        {
          copy:
            'Aliqua. Ut enim ad minim veniam, quis nostrud delo exercitation ullamco laboris nisi ut aliquip ex consequat.',
          author: 'Jeffery Ardell3, UCLA'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

.home-container {
  box-sizing: border-box;
  padding-left: 1rem;
  padding-right: 1rem;
  @media (min-width: 768px) {
    padding-left: 6rem;
    padding-right: 6rem;
  }
}
.homepage-testimonials {
  background: #24245b;
  color: #fff;
  padding: 1.75em 0;
  @media (min-width: 768px) {
    padding: 2em 0 4em;
  }
}
p {
  line-height: 1.875rem;
  margin: 0 0 1.25rem;
  @media (min-width: 768px) {
    font-size: 1.25em;
    line-height: 2rem;
  }
  &::before {
    content: '“';
    position: absolute;
    transform: translateX(-10px);
  }
  &::after {
    content: '“';
  }
}
.homepage-testimonials__testimonial-wrap {
  display: flex;
  padding: 0 1rem;
  @media (min-width: 768px) {
    padding: 0;
  }
}
.homepage-testimonials__testimonial {
  display: none;
  flex: 1 0 0em; // Unit required for IE11
  @media (min-width: 768px) {
    display: block;
    margin: 0 2rem;
  }
  &:first-child {
    margin-left: 0
  }
  &:last-child {
    margin-right: 0
  }
  &--active {
    display: block;
  }
}
.homepage-testimonials__anchor-wrap {
  margin-top: 11px;
  text-align: center;
  @media (min-width: 768px) {
    display: none;
  }
}
.homepage-testimonials__testimonial-anchor {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-block;
  margin: 0 0.3em;
  outline: none;
  padding: 1em;
  &__indicator {
    background: #999;
    display: block;
    height: 0.25rem;
    width: 2rem;
  }
  &:hover,
  &:focus,
  &--active {
    .homepage-testimonials__testimonial-anchor__indicator {
      background: #fff;
    }
  }
}
</style>
