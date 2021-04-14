<template>
  <nav>
    <div class="nav-wrapper bg">
      <ul id="nav-mobile" class="left hide-on-med-and-down row">
<!--
        <li><a><i class="material-icons">title</i></a></li>
        <li><a><i class="material-icons">format_bold</i></a></li>
        <li><a><i class="material-icons">format_italic</i></a></li>
        <div class="clientsIDs">
          &bull; {{ IDs.length }} {{ IDs.length === 1 ? 'user' : 'users' }} connected to {{ namespace }}/{{ room }}
        </div>
-->
        <li class="col s2"><a href="#" class="logo left">GIAS-MD</a></li>
        <li class="col s1 ids"><div class="clientnum z-depth-2"><div class="flex"><i class="material-icons" style="line-height:inherit;margin-right:20px">people_outline</i>{{ IDs.length }}</div></div></li>
        <li class="col s6"><div class="filepath">File path: {{ namespace }}/{{ room }}</div></li>
        <li class="col s3 right">
          <div>
            <a v-if="saving" class="save amber accent-3 z-depth-1">
              Saving...
            </a>
            <a v-else class="save z-depth-1">
              Saved
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TopBar',

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
    }
  },
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
    background-color:#7d7d7d;
    border-radius:0.5rem;
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
    color:#777777;
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

</style>
