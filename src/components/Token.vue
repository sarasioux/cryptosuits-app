<template>
    <div class="box">
        <h2 class="title is-4 playfair">Token #{{id}}</h2>
        <figure class="image is-square" v-if="image">
            <img :src="image" style="image-rendering: pixelated">
        </figure>
        <br />
        <div class="is-size-7" v-for="att in tokenJson.attributes" :key="att">
            <label>{{att.trait_type}}: </label>
            <strong>{{att.value}}</strong>
        </div>
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
      id: Number
    },
    mounted: async function() {
      this.loadToken();
    },
    methods: {
      loadToken: async function() {
        this.tokenUrl = 'https://cryptosuits.herokuapp.com/json2/' + this.id;
        let response = await fetch(this.tokenUrl);
        this.tokenJson = await response.json();
        this.image = this.tokenJson.image;
      },
    }
  }
</script>

<style scoped>

</style>
