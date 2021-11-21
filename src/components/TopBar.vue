<template>
  <nav>
    <div class="nav-wrapper blue-grey lighten-2">
      <ul id="nav-mobile" class="left hide-on-med-and-down row">
<!--
        <li><a><i class="material-icons">title</i></a></li>
        <li><a><i class="material-icons">format_bold</i></a></li>
        <li><a><i class="material-icons">format_italic</i></a></li>
        <div class="clientsIDs">
          &bull; {{ IDs.length }} {{ IDs.length === 1 ? 'user' : 'users' }} connected to {{ namespace }}/{{ room }}
        </div>
-->
        <li class="col s2"><a href="#" class="logo left">GAIS-MD</a></li>
        <li class="col s1 ids">
        <!--
          <div class="indigo lighten-1 clientnum z-depth-1">
            <div class="flex">
              <i class="material-icons" style="line-height:inherit;margin-right:20px">people_outline</i>{{ IDs.length }}
            </div>
          </div>
        -->
        </li>
        <li class="col s5"></li>
        <!--
        <li class="col s5"><div class="filepath">File path: {{ namespace }}/{{ room }}</div></li>
        <li class="col s2">
        </li>
        -->
        <li class="col s4">
          <a href="#modal1" class="right f-20 modal-trigger" @click="seg()">Logout</a>
          <div id="modal1" class="modal modal-fixed-footer">
            <div class="modal-content">
              <h4 class="black-text">Tag choosing</h4>
              <div class="row">
                <div id="chooseboxes" v-for="(tag, index) in tags" :key="index" class="col s3">
                  <label>
                    <input type="checkbox" :id="index" :value="tag" v-model="checked">
                    <span>{{ tag }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <a href="#" class="modal-close waves-effect waves-green btn-flat" @click="logout()">exit</a>
            </div>
          </div>
          <p class="btn-floating right center cyan lighten-1 p-10">{{ IDs.length }}</p>
          <i class="right material-icons" style="line-height:inherit;margin-right:20px">people_outline</i>
          <div class="right p-20">
            <a v-if="saving" class="save amber accent-3 z-depth-1 black-text">
              Saving...
            </a>
            <a v-else class="save z-depth-1 teal lighten-1">
              Saved
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import M from 'materialize-css'

export default {
  name: 'TopBar',

  data () {
    return {
      elems: '',
      instances: '',
      checked: [],
    }
  },

  props: {

    namespace: {
      type: String,
      required: true,
    },

    room: {
      type: String,
      required: true,
    },

    IDs: {
      type: Array, 
    },

    saving: {
      type: Boolean,
    },

    tags: {
      type: Array,
    },
  },

  mounted () {
    this.elems = document.querySelectorAll('.modal');
    this.instances = M.Modal.init(this.elems);
  },

  methods: {
    logout () {
      this.$emit('finalTag', this.checked);
      this.$emit('commitIndex');
      this.$router.push({
        name:'Login',
      })
        .then(() => {
          setTimeout(() => {
            this.$global.$connect = false;
            // console.log(this.$global.$connect);
          }, 1000)
        });
      //this.$global.$connect = false;
      //console.log(this.$global.$connect);
    },

    seg () {
      this.$emit('seg');
    },

    finalTag() {
      this.$emit('finalTag', this.checked);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .filepath {
    font-size:x-large;
    color:#007493;
  }

  .save {
    text-decoration: none;
    color: #fff;
    background-color: #26a69a;
    text-align: center;
    letter-spacing: .5px;
    -webkit-transition: background-color .2s ease-out;
    transition: background-color .2s ease-out;
    cursor: pointer;
    font-size: 14px;
    outline: 0;
    border: none;
    border-radius: 2px;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    padding: 0 16px;
    text-transform: uppercase;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
    width:100px;
  }

  .clientsIDs {
    align-items: center;
    font-weight: bold;
    color: #27b127;
    margin-bottom: 1rem;
    text-transform: uppercase;
    font-size: 0.7rem;
    line-height: 1;
    margin-top:2rem;
  }

  .flex {
    display:inline-flex;
  }

  .ids {
    height:inherit;
    padding:10px;
  }

  .row {
    width:100%;
    height:inherit;
  }

  .clientnum {
/*    background-color:#7d7d7d;*/
    border-radius:2px;
    text-align:center;
    height:inherit;
    line-height:45px;
/*    box-shadow:0 0 3px 1px black;*/
    font-size:20px
  }

  .bg{
    background:#dcdcdc;
  }
  
  .logo{
    font-size:30px;
    padding-left:30px;
    padding-right:30px;
  }

  ul:not(.browser-default) {
    padding-left: 0;
    list-style-type: none;
  }

  ul:not(.browser-default) > li {
    list-style-type: none;
  }

  .f-20 {
    font-size:20px;
  }

  .p-10 {
    margin-right:10px;
  }

  .p-20 {
    margin-right:20px;
  }
</style>
