<template>
  <!--transition name="fade"-->
    <div style="">
      <div class="col s12 login" style="">
        <img src="../assets/gais-md-v2.png" style="height:200px;width:auto">
        <h1 style="padding-bottom:70px"><b>GAIS Markdown Editor</b></h1>
        <div class="row">
          <div class="col s12">
            <div class="row">
                <!--
              <div class="input-field col s12">
                <i class="material-icons prefix">create</i>
                <input id="namespace" placeholder="namespace1/project1" type="text" class="validate" v-model="namespace">
                <label for="namespace" class="active">Namespace</label>
              </div>
              <div class="input-field col s12">
                <i class="material-icons prefix">create</i>
                <input id="room" placeholder="doc1" type="text" class="validate" v-model="room">
                <label for="room" class="active">Room</label>
              </div>
                -->
              <div class="input-field col s12" @click="restore">
                <i class="material-icons prefix">account_circle</i>
                <input id="account" type="text" :class="{ errbar: (emptyname | loginFailed) , validate: true}" v-model="account" name="account">
                <label for="account" :class="{ errfont:emptyname, active: true }">Account</label>
              </div>
              <div class="input-field col s12" @click="restore">
                <i class="material-icons prefix">lock</i>
                <input id="password" type="password" :class="{ errbar: (emptyname | loginFailed) , validate: true}" v-model="password" name="password">
                <label for="password" :class="{ errfont:emptyname, active: true }">Password</label>
              </div>
            </div>
            <div class="collap">
              <transition name="collapse" mode="in-out">
                <div v-if="(emptyname | loginFailed)" class="collap-body">
                  <span v-if="emptyname" class="errmsg">please enter a vaild account or password.</span>
                  <span v-if="loginFailed" class="errmsg">Wrong account or password.</span>
                </div>
              </transition>
            </div>
            <div style="padding:20px" class="row">
              <div class="col s4"></div>
              <div class="col s4">
                <button class="bg-3e6c94 btn-large waves-effect waves-light" type="submit" @click="login()">Login
                  <i class="material-icons right">login</i>
                </button>
              </div>
              <div class="col s1">
                <p>Or</p>
              </div>
              <div class="col s2">
                <!-- <button class="bg-3e6c94 btn-large waves-effect waves-light" type="submit" @click="google()"> -->
                  <img class="btn btn-large waves-effect waves-light white" style="padding:5px" src="../assets/google.svg" alt="loading..." @click="google()">
                <!-- </button> -->
              </div>
            </div>
            <div>
              <p>Don't have an account?
                <a class="modal-trigger" style="cursor:pointer" data-target="signUp">Sign up</a>
              </p>
            </div>

            <div id="signUp" class="modal signUpModal">
              <div class="modal-content" style="height:90%">
                <h1 style="margin-top:60px">Create an Account</h1>
                <div class="acpw">
                  <div class="input-field col s12" @click="restore">
                    <i class="material-icons prefix">account_circle</i>
                    <input id="newAccount" type="text" :class="{ errbar: (emptyname | loginFailed) , validate: true}" v-model="newAccount" name="account">
                    <label for="newAccount" :class="{ errfont:emptyname, active: true }">Enter an Account</label>
                  </div>
                  <div class="input-field col s12" @click="restore">
                    <i class="material-icons prefix">lock</i>
                    <input id="newPassword" type="password" :class="{ errbar: (emptyname | loginFailed) , validate: true}" v-model="newPassword" name="password">
                    <label for="newPassword" :class="{ errfont:emptyname, active: true }">Enter a Password</label>
                  </div>
                  <!-- <div class="input-field col s12" @click="restore"> -->
                  <!--   <i class="material-icons prefix">lock</i> -->
                  <!--   <input id="password" type="password" :class="{ errbar: (emptyname | loginFailed) , validate: true}" v-model="password" name="password"> -->
                  <!--   <label for="password" :class="{ errfont:emptyname, active: true }">Enter a Password again</label> -->
                  <!-- </div> -->
                </div>
              </div>
              <div class="modal-footer" style="height:10%">
                <button class="modal-close waves-effect waves-green btn-flat" @click="create">create</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  <!--/transition-->
</template>

<script>
// import store from '@/store'
import M from 'materialize-css'

export default {
  data (){
    return {
      insert: true,
      //namespace: "namespace1/project1",
      //room: "doc1",
      account: "",
      password: "",
      newAccount: "",
      newPassword: "",
      emptyname: false,
      loginFailed: false,
      session: {},
    }
  },
  
  beforeCreate: function () {
    console.log(this.$store.getters.isLogined);
    if (this.$store.getters.isLogined) {
      this.$router.push('/DocList');
    }
  },

  mounted () {
    this.elem = document.querySelectorAll('.modal');
    this.instance = M.Modal.init(this.elem);
  },

  methods: {
    login: function() {
     // var tmp = document.getElementById('name').value;
     // this.$GLOBAL.name = tmp;
     // this.$emit('getID', this.namespace, this.room);
      if (this.account === "" | this.password === "") {
        this.emptyname = true;
      }
      else {
        //this.$emit('getID', this.account);
        //this.insert = false;
        this.$http.post('http://127.0.0.1:3003/users/Login', { account: this.account, password: this.password })
          .then((data) => {
            if(data.data.message === "Login Success!") {
              // console.log(data.data.data.fileList);
              this.$emit('getID', { account: this.account, filelist: data.data.data.fileList, session: data.data.session});
              this.insert = false;
              this.$store.commit('dataSetting', { 
                session: data.data.session,
                filelist: data.data.data.fileList,
                clientID: this.account,
              });
            }
            else {
              console.log("datas");
              console.log(data.data);
              this.loginFailed = true;
            }
          });
        //this.$http.get('http://140.123.101.148:3000').then((data) => console.log(data.data));
        /*this.$http({
          method: 'post',
          url: 'http://localhost:3000/Login',
          data: {
            name: 'test',
          },
        });*/
      }

    },

    google() {
    /*  this.$http.get('http://localhost:3003/users/OAuth2')
        .then((data) => {
          console.log(data.data);
        });*/
      this.$gAuth.signIn()
        .then(authCode => {
          // console.log(authCode.getAuthResponse().id_token);
          console.log(authCode.wc);
          this.$http.post('http://localhost:3003/users/OAuth2/login', { token: authCode.wc.id_token})
            .then(res => {
              this.$emit('getID', { account: res.data.data.account, filelist: res.data.data.fileList, session: res.data.session});
              console.log(res.data.data);
              this.$store.commit('dataSetting2', { 
                session: res.data.session,
                filelist: res.data.data.fileList,
                clientID: res.data.data.account,
              });
            });
        //on success
        //return this.$http.post('http://your-backend-server.com/auth/google', { code: authCode, redirect_uri: 'postmessage' })
      });
    },

    restore () {
      this.emptyname = false;
      this.loginFailed = false;
    },

    create() {
      this.$http.post('http://localhost:3003/users/SignUp', { account: this.newAccount, password: this.newPassword });
    },
  },
}
</script>

<style>
.login {
  padding-top:20px;
  text-align:center;
  margin-left:auto;
  margin-right:auto;
  width: 600px;
}

.acpw {
  margin-top: 150px;
}

.signUpModal {
  height: 700px;
  width: 600px;
}

.errmsg {
  color:red;
  font-size:15px;
}

.collap {
  display: flex;
  flex-direction:column;
  justify-content:flex-start;
  height: 30px;
}

.collap-body {
  overflow:hidden;
  transition:flex 1s ease;
  height:auto;
  flex:1;
}

.collapse {
  &-enter,
  &-leave-to {
    flex: 0;
  }
}

.errbar {
  border-bottom: 1px solid red !important;
  -webkit-box-shadow: 0 1px 0 0 red;
  box-shadow: 0 1px 0 0 red !important;
}

.errfont {
  color: red !important;
}

.bg-3e6c94 {
  background-color: #3e6c94 !important;
}
</style>
