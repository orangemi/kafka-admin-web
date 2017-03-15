const template = require('./template.pug')
require('./style.css')

module.exports = template({
  props: {
    value: {type: Boolean, default: false}
  },
  data: () => ({
    value_: false
  }),
  mounted () {
    this.value_ = this.value
  },
  watch: {
    value (v) {
      this.value_ = this.value
    }
  },
  methods: {
    change () {
      this.value_ = !this.value_
      this.$emit('input', this.value_)
    }
  }
})
