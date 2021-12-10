<template>
    <div class="section">
        <nav class="pagination" role="navigation" aria-label="pagination">
            <a class="pagination-previous">Prev</a>
            <a class="pagination-next">Next</a>
            <ul class="pagination-list">
                <li v-for="p in getPages()" :key="p">
                    <a class="pagination-link" :class="{'is-current':(p === page)}" @click="page=p">{{p+1}}</a>
                </li>
            </ul>
        </nav>
        <div class="columns is-multiline">
            <div class="column is-2" v-for="token in getTokens()" :key="token">
                <Token
                    :id="token"
                />
            </div>
        </div>

    </div>

</template>

<script>
  import Token from './components/Token';

  export default {
    name: 'App',
    components: {
      Token
    },
    data: function() {
      return {
        page: 0
      }
    },
    mounted: function() {

    },
    methods: {
        getTokens: function() {
          let tokens = [];
          for(let i=1+this.page*50; i<=50+this.page*50; i++) {
            tokens.push(i);
          }
          return tokens;
        },
        getPages: function() {
          let pages = [];
          for(let i=0; i<10000/50; i++) {
            pages.push(i);
          }
          return pages;
        }
    }
  }
</script>

<style>

</style>

