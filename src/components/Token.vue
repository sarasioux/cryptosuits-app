<template>
    <div class="box">
        <h2 class="title is-4 playfair">Token #{{id}}</h2>
        <figure class="image is-square" v-if="image">
            <img :src="image">
        </figure>
    </div>
</template>

<script>
  export default {
    name: 'Token',
    data: function() {
      return {
        tokenUrl: '',
        tokenJson: {},
        image: '',
      }
    },
    watch: {
    },
    props: {
      account: String,
      contract: Object,
      id: Number
    },
    mounted: async function() {
      this.loadToken();
    },
    methods: {
      loadToken: async function() {
        this.tokenUrl = await this.contract.tokenURI(this.id);
        let response = await fetch(this.tokenUrl);
        this.tokenJson = await response.json();
        this.image = this.tokenJson.image;
      },
    }
  }
</script>

<style scoped>

</style>
