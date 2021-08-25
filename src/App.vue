<template>
    <div class="container">
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="https://bulma.io">
                    <h1 class="title">CryptoSuits</h1>
                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                    <a class="navbar-item">
                    <span class="icon is-large">
                        <i class="fab fa-2x fa-twitter"></i>
                    </span>
                    </a>
                    <a class="navbar-item">
                    <span class="icon is-large">
                        <i class="fab fa-2x fa-discord"></i>
                    </span>
                    </a>
                </div>

                <div class="navbar-end">
                    <a class="navbar-item">
                        About CryptoSuits
                    </a>

                    <a class="navbar-item">
                        Attributes
                    </a>

                    <a class="navbar-item">
                        $SUIT Token
                    </a>

                    <a class="navbar-item">
                        Wallet
                    </a>

                    <div class="navbar-item">
                        <a class="button is-primary" v-if="!isConnected" @click="connectWeb3">
                            <strong>Connect Wallet</strong>
                        </a>
                        <span class="tag is-primary" v-if="isConnected">{{account}}</span>
                    </div>
                </div>
            </div>
        </nav>

        <section class="section hero-section">
            <div class="section hero">
                <div class="hero-body">
                    <div class="columns">
                        <div class="column is-4">
                            <div class="figure-wrapper">
                                <figure class="image is-square">
                                    <img src="./assets/suit.png" />
                                </figure>
                            </div>
                        </div>
                        <div class="column is-1"></div>
                        <div class="column">
                            <p class="subtitle">
                                A new NFT series starring your favorite financial industry insiders.  <strong>Forget the Punks. Here are THE SUITS.</strong>
                            </p>
                            <br /><br />
                            <div class="box  has-text-centered">
                                <h1 class="title is-3 has-text-dark">Mint Suits</h1>
                                <div class="columns">
                                    <div class="column">
                                        <p class="subtitle is-6 has-text-dark">Price</p>
                                        <p class="title has-text-primary is-4">{{price}}</p>
                                    </div>
                                    <div class="column">
                                        <p class="subtitle is-6 has-text-dark">Mint Limit</p>
                                        <p class="title has-text-primary is-4">{{maxPurchase}}</p>
                                    </div>
                                    <div class="column">
                                        <p class="subtitle is-6 has-text-dark">Remaining</p>
                                        <p class="title has-text-primary is-4">{{tokensRemaining}}</p>
                                    </div>
                                </div>
                                <div class="field has-addons" :class="{'is-disabled':isMinting}">
                                    <p class="control is-expanded">
                                        <input v-model="mintAmount" class="input" type="text" placeholder="Amount to Mint" :disabled="!isConnected">
                                    </p>
                                    <p class="control">
                                        <button class="button is-primary" @click="mint" :disabled="!isConnected || mintAmount < 1 || mintAmount > maxPurchase">
                                            Mint
                                        </button>
                                    </p>
                                </div>
                                <p class="help" v-if="!isConnected">Connect your wallet to mint Suits.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <div class="section" v-if="myTokens.length > 0">
            <div class="columns is-multiline">
                <div class="column is-12">
                    <h1 class="title">My Suits</h1>
                </div>
                <div class="column is-3"
                     v-for="token in myTokens"
                     :key="token"
                >
                    <Token
                            :id="token"
                            :contract="contract"
                            :account="account"
                    />
                </div>
            </div>
        </div>

        <section class="section">
            <div class="columns">
            <div class="column is-7">
                <h2 class="title is-2">Finally, Affluence on the Blockchain</h2>
                <h3 class="subtitle is-3">Or... What are CryptoSuits?</h3>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <br />
                <div class="quote">
                    <h3 class="title has-text-primary">You don't have to be early, you just have to be rich.</h3>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <br />
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div class="column is-1"></div>
            <div class="column">
                <strong>NEWS</strong>
                <br /><br />
                <div class="card">
                    <div class="card-image">
                        <figure class="image">
                            <img src="./assets/minting-sale.png" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4">Minting Sale</p>
                            </div>
                        </div>

                        <div class="content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                            <a href="#">#css</a> <a href="#">#responsive</a>
                            <br>
                            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </section>

        <div class="section">
            <div class="columns has-text-centered">
                <div class="column is-1"></div>
                <div class="column">
                    <figure class="image is-square">
                        <img src="./assets/decentralized.png" />
                    </figure>
                    <br />
                    <h3 class="title has-text-primary">Decentralized</h3>
                    <p>CryptoSuits are secured by Ethereum, the most trusted and network-efficient smart contract blockchain going today.</p>
                </div>
                <div class="column is-1"></div>
                <div class="column">
                    <figure class="image is-square">
                        <img src="./assets/rare.png" />
                    </figure>
                    <br />
                    <h3 class="title has-text-primary">Rare</h3>
                    <p>Only 10,000 CryptoSuits will ever exist.  Just like the affluent families who run the world, there can only be so many, for earthly rarity is itself non-fungible.</p>
                </div>
                <div class="column is-1"></div>
                <div class="column">
                    <figure class="image is-square">
                        <img src="./assets/money.png" />
                    </figure>
                    <br />
                    <h3 class="title has-text-primary">Money</h3>
                    <p>It is important to have it.</p>
                </div>
                <div class="column is-1"></div>
            </div>
        </div>

        <figure class="image">
            <img src="./assets/banner.png" />
        </figure>
        <div class="section has-background-primary">
            Footer section
        </div>

        <Admin
            v-if="isAdmin() && isReady"
            :contract="contract"
            :account="account"
            />
    </div>

</template>

<script>
  import Admin from './components/Admin';
  import Token from './components/Token';
  import CryptoSuits from '../public/contracts/CryptoSuits.json';
  import TruffleContract from '@truffle/contract'

  export default {
    name: 'App',
    components: {
      Admin, Token
    },
    data: function() {
      return {
        currentTokenId: 0,
        price: 0.02,
        maxPurchase: 20,
        tokensRemaining: 10000,

        myTokens: [],

        account: '',
        contract: {},
        connectionInProgress: false,
        isConnected: false,

        mintAmount: '',
        isMinting: false,
        isReady: false,
      }
    },
    methods: {
      isAdmin: function() {
        return true;
      },
      connectWeb3: async function () {
        this.connectionInProgress = true;
        try {
          // Request account access
          let accounts = await this.$web3.currentProvider.send('eth_requestAccounts');
          this.account = accounts.result[0];
          this.connectionInProgress = false;
          await this.initContracts();
          this.isConnected = true;
        } catch (error) {
          // User denied account access
          console.log('did not receive accts', error);
        }
      },
      initContracts: async function () {
        let contract = TruffleContract(CryptoSuits);
        contract.setProvider(this.$web3.currentProvider);
        contract.defaults({
          from: this.account
        });
        this.contract = await contract.deployed();
        this.loadData();
      },
      loadData: async function () {
        this.currentTokenId = parseInt(await this.contract.getCurrentId.call());
        this.maxSupply = parseInt(await this.contract.maxSupply.call());
        this.tokensRemaining = this.maxSupply - this.currentTokenId;
        this.maxPurchase = parseInt(await this.contract.maxPurchase.call());
        this.price = parseInt(await this.contract.price.call()) / 1e18;
        this.myTokens = [];
        let tokens = await this.contract.getByOwner.call(this.account);
        for(let i=0; i<tokens.length; i++) {
          this.myTokens.push(parseInt(tokens[i]));
        }
        this.isReady = true;
      },

      mint: async function() {
        if(this.mintAmount > 0 && this.mintAmount <= this.maxPurchase) {
          this.isMinting = true;
          await this.contract.mint(this.mintAmount, this.account, {value: this.mintAmount * this.price * 1e18, type: '0x2'});
          this.loadData();
          this.isMinting = false;
          alert('Congratulations your mint is complete!');
        } else {
          alert('Please input a valid mint amount.');
        }
      },
    }
  }
</script>

<style>
    .hero-section {
        padding: 0;
        /*background: url('./assets/herobg.png') top left repeat-x;*/

    }
    .hero-section .hero {
        padding: 0;
    }
    /*
    .hero-subtitle {
        float: right;
        width: 500px;
    }
    .hero {
        margin-top: 100px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .is-suit {
        margin-top: -165px;
        margin-bottom: -50px;
    }
*/
    .quote {
        float: right;
        width: 400px;
        margin: 1.8em;
    }
</style>
