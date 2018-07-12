/*eslint-disable */
let listenAction
let originalHeight
let currHeight
export default new Object().install = (Vue, options = {}) => {
  Vue.directive('foot', {
    insert(el, binding) {
      const elStyle = el.style
      let active = false
      originalHeight = document.body.clientHeight
      const reset = () => {
        if (!active) {
          return
        }
        elStyle.display = 'flex'
        active = false
      }
      const hang = () => {
        if (active) {
          return
        }
        elStyle.display = 'none'
        active = true
      }
      const getCurrHeight = () => {
        let getHeight = document.body.clientHeight
        return getHeight
      }
      const check = () => {
        alert(originalHeight)
        currHeight = getCurrHeight()
        if (currHeight != originalHeight) {
          hang()
        } else {
          reset()
        }
      }
      listenAction = () => {
        check()
      }
      window.addEventListener('resize', listenAction)
    },
    unbind() {
      window.removeEventListener('resize', listenAction)
    }
  })
}