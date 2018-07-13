<template>
    <div class="page-group">
        <div class="page" id="page-wallet-import">
          <sic-header :left-options="{backText: ''}">{{$t('wallet_import.title')}}</sic-header>
            <div class="content">
                <div class="block-pwd">
                    <x-textarea v-model="wifKey" :rows="8" :placeholder="$t('wallet_import.placeholder.key')" @on-blur="wifKeyTextAreaChange" @on-focus="focus"></x-textarea>
                </div>
                <!-- <div class="content-block block-tip">
                    <div class="tip-error" v-if="error.common">
                        {{error.common}}
                    </div>
                </div> -->
                <x-button :disabled="!wifKey" class="confirm-btn" type="primary" @click.native="onSubmit">{{$t('wallet_import.confirm')}}</x-button>
            </div>
        </div>
        <div v-transfer-dom>
          <password-confirm v-show="isUnlock" isDecrypt :iShowLock="isUnlock" ref="confirm" @setUnlock="setUnlock" @unlocking="unlocking"></password-confirm>
          <!-- <alert v-model="submitting" button-text=" ">
            <msg slot="default" :title="title" :buttons="buttons" :icon="icon"></msg>
          </alert> -->
        </div>
        <div v-transfer-dom>
          <import-view v-show="isShow" isShow :type="viewType" @setViewConfirm="setViewConfirm"></import-view>
        </div>
    </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import PasswordConfirm from '../components/PasswordConfirm.vue'
import importView from '../components/import'
import {XTextarea, XInput, XButton, TransferDomDirective as TransferDom} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    sicHeader,
    XTextarea,
    XInput,
    XButton,
    importView,
    PasswordConfirm
  },
  data () {
    return {
      tabIndex: 1,
      submitting: false,
      wifKey: '',
      pwd: '',
      error: {
        common: ''
      },
      viewType: '',
      isUnlock: false,
      isShow: false,
      icon: 'success',
      title: '',
      buttons: [{
        type: 'primary',
        text: '',
        link: '/'
      }]
    }
  },
  methods: {
    setUnlock (val) {
      this.isUnlock = val
    },
    unlocking (flag, pwd) {
      this.isUnlock = flag
      this.pwd = pwd
      this.createByWifKey()
    },
    onSubmit () {
      this.isUnlock = true
    },
    createByWifKey () {
      setTimeout(() => {
        try {
          let setData = this.$common.backupImport(this.wifKey, this.pwd)
          setData.active = this.$common.encryption(setData.active, this.pwd)
          setData.owner = this.$common.encryption(setData.owner, this.pwd)
          setData.activePubkey = this.$common.backupPublicKey(setData.active, this.pwd)
          setData.ownerPubkey = this.$common.backupPublicKey(setData.owner, this.pwd)
          setData.backup_date = null
          let wallets = this.$common.get_wallets()
          let encryptionWalletArr = this.$common.getStore('account')
          wallets.push(setData)
          let encryptionWallet = this.$common.encryption(JSON.stringify(setData), this.pwd)
          encryptionWalletArr.push({
            account: setData.account,
            encryption: encryptionWallet
          })
          this.$store.state.account = setData.account
          console.log(setData.account)
          this.$common.setStore('account', this.$common.unique(encryptionWalletArr))
          this.$common.set_wallets(wallets)
          this.$store.commit('setAccount', setData.account)
          wallets.map(item => {
            if (item.account === setData.account) {
              this.$common.set_wallets(this.$common.unique(wallets))
            }
          })
          this.viewType = 'success'
          this.isShow = true
        } catch (error) {
          this.viewType = 'error'
          this.isShow = true
        }
      }, 50)
    },
    wifKeyTextAreaChange () {
      if (this.wifKey.indexOf('(hide)') > -1) {
        this.wifKey = this.wifKey.replace('(hide)', '').trim()
      }
    },
    setViewConfirm () {
      this.isShow = false
      this.viewType = ''
      this.wifKey = ''
    },
    focus () {
    }
  }
}
</script>

<style scoped lang="less">
.page-group{
  height: 100%;
  width: 100%;
}
.block-pwd{
  padding: 1.428571rem 1.071429rem;
  
}


.confirm-btn{
  position: absolute;
  bottom: 0;
  padding: .357143rem 0;
}

</style>
