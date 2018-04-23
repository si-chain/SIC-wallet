<template>
    <div class="page-group">
      <x-header :left-options="{backText: ''}">备份私钥</x-header>
      <div class="page" id="page-wallet-backup-detail">
        <div class="content">
          <div class="tip-info">
              {{$t('wallet_backup.detail.tip')}}
          </div>
          <div class="content-block">
            <div class="tip-warning" :class="{'text-center':!wifKey}" id='copywin'>
              {{wifKey || '****************************'}}
            </div>
            <p class="tip-error text-center" v-if="error.common">{{error.common}}</p>
            <x-button v-if="!wifKey" type="primary" @click.native="unlock">{{$t('wallet_backup.detail.unlock')}}</x-button>
          </div>
          <ul class="tips color-danger">
            <li>
              {{$t('wallet_backup.detail.tip1')}}
            </li>
            <li>
              {{$t('wallet_backup.detail.tip2')}}
            </li>
          </ul>
          <div class="button-block" v-if="wifKey">
            <flexbox>
              <flexbox-item>
                <x-button type="primary" id='copy' data-clipboard-target="#copywin" @click.native="copyKey()">{{keyCopied ? $t('wallet_backup.detail.copied') : $t('wallet_backup.detail.copy')}}</x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button type="primary" link="/">{{$t('wallet_backup.detail.go_back')}}</x-button>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>
      <password-confirm v-if="isUnlock" ref="confirm" @setUnlock="setUnlock" @unlocking="unlocking"></password-confirm>
    </div>
</template>
<script>
import { XButton, XHeader, Group, Cell, Flexbox, FlexboxItem } from 'vux'
import Clipboard from 'clipboard'
import PasswordConfirm from '../components/PasswordConfirm.vue'

export default {
  components: {
    XButton,
    XHeader,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    PasswordConfirm
  },
  data () {
    return {
      wifKey: '',
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
    unlocking (pwd) {
      let self = this
      if (!pwd.trim()) {
        this.error.common = this.$t('unlock.error.invalid_password')
        return
      }
      let account = this.$route.query.account
      let wallets = this.$common.get_wallets()
      // let wallets = this.$store.state.wallets
      // let wallets = this.$store.state.wallets
      console.log(account)
      let wallet = wallets.find(w => {
        return w.account === account
      })
      let publicWallet = this.$common.backupPublicKey(wallet.active, pwd)
      let activePubkey = wallet.active_pubkey
      if (wallet == null) {
        self.isUnlock = false
        self.error.common = self.$t('unlock.account_not_found')
      } else if (activePubkey !== publicWallet) {
        self.isUnlock = false
        self.error.common = self.$t(
          'wallet_backup.detail.error.invalid_password'
        )
      } else {
        let data = {
          account: wallet.account,
          active: wallet.active,
          owner: wallet.owner
        }
        let wifKey = this.$common.backupExport(data, pwd)
        self.wifKey = wifKey
        self.wallet = wallet
        self.isUnlock = false
      }
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
.vux-header{
  background-color: #ffffff
}
.bar-nav~.content {
    top: 2.2rem;
}
.content-block {
    margin: 1.75rem 0;
    padding: 0 .75rem;
    color: #6d6d72;
}
.text-right {
  text-align: right;
}
.tip-warning {
    padding: .5rem;
    font-weight: bold;
    text-align: center;
}
button.weui-btn {
    border-radius: 20px;
}
.tip-warning {
    background: #fff5e6;
    border: 1px solid #ffebcc;
    border-radius: 6px;
    color: #495060;
    font-size: .6rem;
    padding: .3rem;
    margin-bottom: 20px;
    white-space: normal;
    word-break: break-all;
}
.tip-info {
  word-break: break-word;
}
.tip-info {
    background: #d6edf8;
    color: #5393bc;
    font-size: .6rem;
    padding: .3rem;
    white-space: normal;
    word-break: break-all;
}
.tip-warning {
  padding: 0.5rem;
  font-weight: bold;
}
.tip-error {
    background: #fbf2f1;
    color: #c2433b;
    font-size: .6rem;
    padding: .3rem;
    text-align: center;
    border-radius: 5px;
    margin-bottom: 10px;
    white-space: normal;
    word-break: break-all;
}
.tips {
    font-size: .6rem;
    padding-left: 1.5rem;
}
.color-danger {
    color: #ed3f14 !important;
    font-weight: bold;
}

.link-green {
  font-size: 0.75rem;
}

.button-block {
  margin-top: 4rem;
  padding:0 16px;
}
</style>
