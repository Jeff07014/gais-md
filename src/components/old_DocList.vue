<template>
  <div style="text-align:center">

  <ul id="slide-out" class="sidenav">
    <li>
      <h3>Tag filter</h3>
    </li>
    <li>
      <div class="divider"></div>
    </li>
    <li v-for="tag in tagPool" :key="tag">
      <label>
        <input
          class="filled-in"
          type="checkbox"
          :value="tag"
          v-model="testArray"
          @change="filter"
        />
        <span>{{tag}}</span>
      </label>
    </li>
  </ul>
    <div>
      <h1>{{ clientID }}</h1>

      <div class="row">
          <div class="blank col s3">
          </div>
          <div class="input-field col s3">
              <input value="" id="queryString" type="text" class="validate" v-model="queryString">
              <label class="active" for="queryString">Search</label>
          </div>
          <div class="col s1">
              <button class="btn search" @click="searchNote()">search</button>
          </div>
          <div class="col s1">
              <button data-target="slide-out" class="btn sidenav-trigger" @click="tagset()">taglist</button>
          </div>
      </div>
    </div>

    <div v-for="i in parseInt(filelist.length / 3)" :key="i.id" class="row">
      <div class="" v-for="j in 3" :key="j.id">
        <div class="col s4" v-if="filelist[((i - 1) * 3) + (j - 1)].isShow == true">
          <div class="docs card blue-grey" @click="getDoc(filelist[((i - 1) * 3) + (j - 1)])">
            <div class="card-content white-text" v-for="(value, name) in filelist[((i - 1) * 3) + (j - 1)]" :key="value.id">
              <span class="card-title" v-if="name == 'room'">{{ value }}</span>
              <div class="card-action" v-if="name == 'tags'">
                <div v-for="tag in value" class="chip" :key="tag.id">{{ tag }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor } from 'tiptap'
import { Collaboration } from 'tiptap-extension-collaboration'
import M from 'materialize-css'

export default {
  name: 'DocList',
  props: {
    clientID: {
      type: String,
      required: true,
    },
    
    filelist: {
      type: Array,
    }
  },

  data () {
    return {
      tagPool: null,
      tagChoose: null,
      testArray: [],
      queryString: '*',
      queryHandler: new Editor({
          extensions: [
            new Collaboration({
            socketServerBaseURL: 'http://140.123.101.147:6002',
            namespace: 'queryHandler',
            room: 'queryHandler',
            clientID: this.clientID,

            debounce: 250,
            keepFocusOnBlur: false,

            onConnected: (state) => {
                console.log('queryHandler:', state);
            },
            onConnectedFailed: (error) => {
                console.log(error);
            },
            onResponse: (res) => {
                console.log(res);
                this.$emit('changeDoc', res);
            },
            onDisconnected: () => {},
            onClientsUpdate: () => {},
            onSaving: () => {},
            onSaved: () => {},
            })
        ] 
      })
    }
  },

  methods: {
    getDoc (doc) {
      // console.log(doc.id);
      // console.log(doc.namespace);
      // console.log(doc.room);
      this.$emit('getDoc', doc.namespace, doc.room, doc.id, doc.tags);
    },

    log () {
      // console.log(this.filelist);
    },

    tagset () {
      this.tagPool = new Set();
      this.tagChoose = new Set();

      this.filelist.forEach((file) => {
        this.tagPool = this.tagPool.union(file.tags);
        file.isShow = true;
      });
    },

    filter(){
      this.tagChoose = new Set(this.testArray);
      var newTagPool = new Set();
      this.filelist.forEach((file) => {
        file.isShow = false;
        if(this.tagChoose.intersection(file.tags).size === this.tagChoose.size){
          file.isShow = true;
          newTagPool = newTagPool.union(file.tags);
        }
      });
      this.tagPool = newTagPool;
    },

	searchNote() {
		this.queryHandler.extensions.extensions.find((e) => e.name === 'collaboration').searchNote(this.queryString);
	},
  },

  mounted () {
    this.elem = document.querySelectorAll('.sidenav');
    this.instance = M.Sidenav.init(this.elem);
    /* this.filelist.forEach((file) => {
        file.isShow = true;
    });*/
    // console.log(this.filelist);
    Set.prototype.isSuperset = function(subset) {
        for (var elem of subset) {
            if (!this.has(elem)) {
                return false;
            }
        }
        return true;
    }

    Set.prototype.union = function(setB) {
        var union = new Set(this);
        for (var elem of setB) {
            union.add(elem);
        }
        return union;
    }

    Set.prototype.intersection = function(setB) {
        var intersection = new Set();
        for (var elem of setB) {
            if (this.has(elem)) {
                intersection.add(elem);
            }
        }
        return intersection;
    }

    Set.prototype.difference = function(setB) {
        var difference = new Set(this);
        for (var elem of setB) {
            difference.delete(elem);
        }
        return difference;
    }
    this.tagset();

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.docs {
  height:300px;
  margin-bottom:20px;
}

.row {
  margin:20px;
}

.doc {
  width:50%;
  height:inherit;
}

ul li {
  list-style:none;
  text-align:left;
}
</style>
