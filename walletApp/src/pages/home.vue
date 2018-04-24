<template>
  <div style="height:100%;">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <account-home :wallet="wallets[0]"></account-home>

  </div>
</template>

<script>
import { TransferDom, Loading } from 'vux'
import util from '../libs/utils'
import AccountHome from '../components/AccountHome'
export default {
  name: 'index',
  directives: {
    TransferDom
  },
  components: {
    AccountHome,
    Loading
  },
  methods: {
    onClickMore () {
      this.showMenu = true
    },
    changeLocale (locale) {
      util.setStore('_locale', locale)
      this.$i18n.locale = locale
    }
  },
  mounted () {
    this.handler = () => {
      if (this.path === '/') {
        this.box = document.querySelector('#demo_list_box')
        this.updateDemoPosition(this.box.scrollTop)
      }
    }
  },
  beforeDestroy () {
    this.box && this.box.removeEventListener('scroll', this.handler, false)
  },
  created () {
    this.wallets = this.$common.get_wallets()
    console.log(this.$route.path)
  },
  data () {
    return {
      showMenu: false,
      menus: {
        'language.noop': '<span class="menu-title">Language</span>',
        'zh-CN': '中文',
        'en-US': 'English'
      },
      path: '/',
      isLoading: false,
      direction: 'forward',
      drawerVisibility: false,
      showMode: 'push',
      showModeValue: 'push',
      showPlacement: 'left',
      wallets: [],
      showPlacementValue: 'left'
    }
  }
}
</script>
<style lang="less" scoped>
.account-image-wrap{
  text-align: center;
  padding: 30px 0;
}
.sys{
  width: 25px;
  height: 25px;
}
.vux-header{
  background-color: #ffffff
}
// @header-background-color:#fff
</style>
