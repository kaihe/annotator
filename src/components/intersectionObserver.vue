<template>
    <div class="wrap" ref="el">
        <div v-if="mounted" class="content-wrap" ref="content">
            <slot name="in"></slot>
        </div>
        <div v-if="!mounted" class="placeholder-wrap" :style="{minHeight, height: this.height || '2em' }">
            <slot name="out"></slot>
        </div>
    </div>
</template>
<script>
import throttle from '@/libs/throttle.js'
export default {
  name: 'intersectionObserver',
  props: ['root', 'height'],
  data () {
    return {
      observer: null,
      scrollHandle: throttle(this.scrollThrottle, 200, this, true),
      mounted: false,
      minHeight: '0'
    }
  },
  methods: {
    init () {
      if ('IntersectionObserver' in window &&
        'InterserctionObserverEntry' in window &&
        'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
        this.observer = new IntersectionObserver(entries => {
          if (entries[0].intersectionRatio > 0) {
            this.show()
          } else {
            this.hide()
          }
        }, {
          root: this.root || null,
          threshold: [0, 0.25, 0.5, 0.75, 1]
        })
      }
    },
    startObserve () {
      if (this.observer) {
        this.observer.observe(this.$el)
      } else {
        (this.root || window).addEventListener('scroll', this.scrollHandle, true)
        this.scrollHandle()
      }
    },
    endObserve () {
      if (this.observer) {
        this.observer.disconnect()
      } else {
        (this.root || window).removeEventListener('scroll', this.scrollHandle, true)
      }
    },
    scrollThrottle () {
      const offset = this.$el.getBoundingClientRect()
      const offsetTop = offset.top
      const offsetBottom = offset.bottom
      const offsetHeight = offset.height

      if (offsetTop <= window.innerHeight && offsetBottom >= 0) {
        this.show()
      } else {
        this.hide()
      }
    },
    show () {
      this.mounted = true
      this.$emit('in')
    },
    hide () {
      this.setHight()
      this.mounted = false
      this.$emit('out')
    },
    setHight () {
      // pass
    }
  },
  mounted () {
    this.init()
    this.startObserve()
  },
  beforeDestroy () {
    this.endObserve()
  }
}
</script>
