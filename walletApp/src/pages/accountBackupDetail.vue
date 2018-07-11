<template>
    <div class="page-group" style="overflow:hidden">
      <sic-header :left-options="{backText: ''}">{{$t('index.backup_wallet')}}</sic-header>
      <div class="page" id="page-wallet-backup-detail">
        <div class="content">
          <div class="content-head">
            <div class="content-block">
              <div class="tip-warning" :class="{'text-center':!wifKey}" id='copywin'>
                {{wifKey || '****************************'}}
              </div>
              <p class="tip-error text-center" v-if="error.common">{{error.common}}</p>
            </div>
            <ul class="tips color-danger">
              <li>
                {{$t('wallet_backup.detail.tip')}}
              </li>
              <li>
                {{$t('wallet_backup.detail.tip1')}}
              </li>
              <li>
                {{$t('wallet_backup.detail.tip2')}}
              </li>
            </ul>
          </div>
          <x-button class="unlock" v-if="!wifKey" type="primary" @click.native="unlock">{{$t('wallet_backup.detail.unlock')}}</x-button>
          <div class="button-block" v-if="wifKey">
            <x-button type="primary" id='copy' data-clipboard-target="#copywin" @click.native="copyKey()">{{keyCopied ? $t('wallet_backup.detail.copied') : $t('wallet_backup.detail.copy')}}</x-button>
            <x-button type="default" @click.native="showPlugin" >{{$t('wallet_backup.detail.go_back')}}</x-button>
          </div>
        </div>
      </div>
      <password-confirm v-show="isUnlock" :iShowLock="isUnlock" ref="confirm" @setUnlock="setUnlock" @unlocking="unlocking"></password-confirm>
    </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import { XButton, Group, Cell, Flexbox, FlexboxItem, Confirm } from 'vux'
import Clipboard from 'clipboard'
import PasswordConfirm from '../components/PasswordConfirm.vue'

export default {
  components: {
    XButton,
    sicHeader,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    PasswordConfirm,
    Confirm
  },
  data () {
    return {
      wifKey: '',
      show: false,
      keyCopied: false,
      unlocked: false,
      isUnlock: false,
      wallet: {},
      error: {
        common: ''
      }
    }
  },
  methods: {
    unlock () {
      this.error.common = ''
      this.isUnlock = true
    },
    unlocking (flag, pwd) {
      console.log(flag)
      let self = this
      let account = this.$route.query.account
      let wallets = this.$common.get_wallets()
      // let wallets = this.$store.state.wallets
      // let wallets = this.$store.state.wallets
      let wallet = wallets.find(w => {
        return w.account === account
      })
      if (!flag) {
        let data = {
          account: wallet.account,
          active: wallet.active,
          owner: wallet.owner
        }
        let wifKey = this.$common.backupExport(data, pwd)
        self.wifKey = wifKey
        self.wallet = wallet
      }
      self.isUnlock = flag
    },
    copyKey () {
      let clipboard = new Clipboard('#copy')
      clipboard.on('success', e => {
        this.keyCopied = true
        let wallets = this.$common.get_wallets()
        wallets.map((item, index) => {
          if (item.account === this.$route.query.account) {
            item.isBackUp = true
            this.$store.commit('BACKUPWALLET', index)
          }
        })
        this.$common.set_wallets(wallets)
        setTimeout(() => {
          this.keyCopied = false
        }, 1000)
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        console.log('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    backup () {
      let wallet = this.wallet
      wallet.backup_date = new Date().getTime()
      this.$common.update_wallet(wallet)
      this.$router.replace({
        path: '/'
      })
    },
    showPlugin () {
      let se = this
      if (this.unlocked) {
        if (!se.wallet.backup_date) {
          this.$vux.confirm.show({
            title: this.$t('wallet_backup.detail.confirm'),
            content: '',
            onConfirm () {
              se.backup()
            }
          })
        } else {
          se.$router.replace({
            path: '/'
          })
        }
      } else {
        se.$router.replace({
          path: '/'
        })
      }
    },
    setUnlock (val) {
      this.isUnlock = val
    }
  },
  mounted () {
  }
}
</script>
<style scoped lang="less">
.pull-to-refresh-layer {
  .line-scale > div {
    background-color: #ccc;
  }
}
.bar-nav~.content {
    top: 2.2rem;
}
.content-head{
  padding: 2.142857rem;
}
.text-right {
  text-align: right;
}
.tip-warning {
    text-align: center;
    background: #f1f1f1;
    padding: .714286rem 1.071429rem;
    border-radius: 1.428571rem;
    color: #666666;
    font-size: @font-size3;
    margin-bottom: 20px;
    white-space: normal;
    word-break: break-all;
    font-weight: 500;
}
.tip-info {
  word-break: break-word;
}
.tip-info {
  width:96%;
  text-align:left;
  margin:0 auto;
  font-size: 12px;
  margin-top:10px;
  line-height: 16px;
  color: #999;
}
.tip-error {
    background: #fbf2f1;
    color: #c2433b;
    font-size: 12px;
    padding: .3rem;
    text-align: center;
    border-radius: 5px;
    margin-bottom: 10px;
    white-space: normal;
    word-break: break-all;
}
.tips {
    font-size: 12px;
    padding-left: 1.5rem;
    list-style: outside;
    li{
      margin-top: 1.428571rem;
      font-size: @font-size4;
      color: #666666;
    }
}

.link-green {
  font-size: 0.75rem;
}
.unlock{
  position: absolute;
  bottom: 0;
  padding: .357143rem 0;
}
</style>
