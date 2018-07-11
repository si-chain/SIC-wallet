<template>
    <div class="page-group">
        <div class="page" id="page-wallet-import">
          <sic-header>{{$t('wallet_import.title')}}</sic-header>
            <div class="content">
                <div class="list-block block-pwd">
                    <ul>
                        <li class="align-top">
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-input item-required">
                                        <span>*</span>
                                        <x-textarea v-model="wifKey" :rows="5" :placeholder="$t('wallet_import.placeholder.key')" @on-blur="wifKeyTextAreaChange" @on-focus="focus"></x-textarea>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-input">
                                      <group>
                                        <x-input v-model="pwd1" :title="$t('wallet_import.label.password')" :required="true" type="password" :placeholder="$t('wallet_import.label.password')">
                                          <x-button slot="right" type="primary" mini @click.native="onSubmit">{{$t('wallet_import.confirm')}}</x-button>
                                        </x-input>
                                      </group>

                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block block-tip">
                    <div class="tip-error" v-if="error.common">
                        {{error.common}}
                    </div>
                </div>
            </div>
        </div>
        <div v-transfer-dom>
          <alert v-model="submitting" button-text=" ">
            <msg slot="default" :title="title" :buttons="buttons" :icon="icon"></msg>
          </alert>
        </div>
    </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import {XTextarea, Group, Msg, Alert, XInput, XButton, TransferDomDirective as TransferDom} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    sicHeader,
    XTextarea,
    XInput,
    XButton,
    Msg,
    Group,
    Alert
  },
  data () {
    return {
      tabIndex: 1,
      submitting: false,
      wifKey: '',
      pwd1: '',
      error: {
        common: ''
      },
      icon: 'success',
      title: '',
      buttons: [{
        type: 'primary',
        text: '',
        link: '/'
      }]
    }
  },
  watch: {
    tabIndex () {
      this.error = {
        common: ''
      }
    },
    pwd1 () {
      this.error = {
        common: ''
      }
    },
    wifKey () {
      this.error.common = ''
    }
  },
  computed: {
    isEqual () {
      return this.pwd1
    }
  },
  mounted () {
    if (!this.$common.get_disclaimer_accepted()) {
      // let query = {
      //   from: this.$route.path
      // }
      // this.$router.push({
      //   path: '/disclaimer', query
      // })
    }
  },
  methods: {
    validate () {
      this.wifKey = this.wifKey.trim()
      if (this.wifKey === '') {
        this.error.common = this.$t('index.import_key_isnull')
        return false
      }
      if (!this.isEqual) {
        this.error.common = this.$t('wallet_backup.detail.placeholder.password')
        return false
      }
      return true
    },
    onSubmit () {
      if (!this.validate()) {
        return
      }
      this.createByWifKey()
    },
    createByWifKey () {
      setTimeout(() => {
        try {
          let setData = this.$common.backupImport(this.wifKey, this.pwd1)
          // if (!setData) {
          //   this.submitting = true
          //   this.icon = 'warn'
          //   this.title = this.$t('wallet_import.error.no_reference_account')
          //   this.buttons[0].type = 'warn'
          //   this.buttons[0].text = this.$t('wallet_import.error.title')
          //   this.buttons[0].link = '/account-import'
          // } else {
          setData.active = this.$common.encryption(setData.active, this.pwd1)
          setData.owner = this.$common.encryption(setData.owner, this.pwd1)
          setData.activePubkey = this.$common.backupPublicKey(setData.active, this.pwd1)
          setData.ownerPubkey = this.$common.backupPublicKey(setData.owner, this.pwd1)
          setData.backup_date = null
          let wallets = this.$common.get_wallets()
          let encryptionWalletArr = this.$common.getStore('account')
          wallets.push(setData)
          let encryptionWallet = this.$common.encryption(JSON.stringify(setData), this.pwd1)
          encryptionWalletArr.push({
            account: setData.account,
            encryption: encryptionWallet
          })
          this.$common.setStore('account', this.$common.unique(encryptionWalletArr))
          this.$common.set_wallets(wallets)
          this.$store.commit('setAccount', setData.account)
          this.submitting = true
          this.icon = 'success'
          this.title = this.$t('wallet_import.success.title')
          this.buttons[0].type = 'primary'
          this.buttons[0].text = this.$t('wallet_import.success.title')
          this.buttons[0].link = '/'
          wallets.map(item => {
            if (item.account === setData.account) {
              this.$common.set_wallets(this.$common.unique(wallets))
            }
          })
          // }
        } catch (error) {
          this.error.common = this.$t('wallet_import.error.no_reference_account')
        }
      }, 50)
    },
    wifKeyTextAreaChange () {
      if (this.wifKey === '') {
        this.error.common = this.$t('index.import_key_isnull')
        return
      }
      if (this.wifKey.indexOf('(hide)') > -1) {
        this.wifKey = this.wifKey.replace('(hide)', '').trim()
      }
    },
    keepOn () {
      this.submitting = false
    },
    focus () {
      this.error.common = ''
    }
  }
}
</script>

<style scoped lang="less">
.block-pwd {
  ul:before {
    height: 0;
  }
}

.block-tab {
  margin: 0.2rem 0;
  ul {
    border-left: 0.05rem solid #e7e7e7;
    border-right: 0.05rem solid #e7e7e7;
  }
}

.block-button {
  margin-top: 5px;
}

.block-tip {
  margin: 5px 0 0 0;
  .tip-error {
    text-align: center;
    color: #ea3a3a;
  }
}

.item-required {
  position: relative;
  background: #ffffff;
  border-top: 1px solid #e7e7e7;
  span {
    color: red;
    position: absolute;
    top: 0.5rem;
    left:.1rem;
    font-weight: bold;
  }
}

.item-required textarea {
  padding-left: 0.5rem;
}
</style>
