<template>
    <a class="admin-link has-text-light" @click="modalActive=(modalActive===false)">
        <span class="icon">
            <i class="fas fa-cog"></i>
        </span>
    </a>
    <div class="modal" :class="{'is-active':modalActive}">
        <div class="modal-background"  @click="modalActive=(modalActive===false)"></div>
        <div class="modal-content has-background-white">
            <div class="admin">
                <nav class="panel">
                    <p class="panel-heading">
                        Admin
                    </p>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Base URI</label>
                        </div>
                        <p class="control is-expanded">
                            <input
                                v-model="baseUri"
                                class="input is-fullwidth"
                                type="text"
                                placeholder="http://localhost:3000/bingo-json/"
                            />
                        </p>
                        <p class="control is-expanded">
                            <button class="button is-primary" @click="saveUri">Save</button>
                        </p>
                   </div>
                    <div class="panel-block">
                        <div class="field-label is-normal">
                            <label class="label">Start Sale</label>
                        </div>
                        <div class="select is-expanded">
                            <select v-model="startSaleOption">
                                <option>true</option>
                                <option>false</option>
                            </select>
                        </div>
                        <p class="control is-expanded">
                            <button class="button is-primary" @click="saveSale">Save</button>
                        </p>
                    </div>

                </nav>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close"  @click="modalActive=(modalActive===false)"></button>
    </div>
</template>

<script>
  export default {
    name: 'Admin',
    data: function() {
      return {
        modalActive: false,
        baseUri: '',
        startSale: false,
        startSaleOption: ''
      }
    },
    props: {
      account: String,
      contract: Object,
    },
    mounted: function() {
      this.loadData();
    },
    methods: {
      loadData: async function() {
        this.baseUri = await this.contract.baseUri.call();
        this.startSale = await this.contract.startSale.call();
        if(!this.startSale) {
          this.startSaleOption = 'false';
        } else {
          this.startSaleOption = 'true';
        }
      },
      saveSale: async function() {
        let saveSale = false;
        if(this.startSaleOption === 'true') {
          saveSale = true;
        }
        let response = await this.contract.setSaleStart(saveSale);
        console.log(response);
      },
      saveUri: async function() {
        let response = await this.contract.setBaseUri(this.baseUri);
        console.log(response);
      }
    }
  }
</script>

<style scoped>
    .field-label {
        min-width: 100px;
    }
    .admin-link {
        position: fixed;
        bottom: 10px;
        right: 10px;
    }
</style>
