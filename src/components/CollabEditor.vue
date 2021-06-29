<template>
  <div>
    <TopBar
      @seg="seg"
      @finalTag="finalTag"
      :namespace="namespace"
      :room="room"
      :IDs="clientsIDs"
      :tags="tags"
      :saving="saving">
    </TopBar>
    <div class="mdpanel">
      <template v-if="editor && !loading">
        <EditorContent class="editor__content" :editor="editor"  />
      </template>
      <em v-else>
        Connecting to socket server …
      </em>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Bold,
  Code,
  Italic,
  Link,
  History,
  Image,
} from 'tiptap-extensions'
import {Cursors, Collaboration} from 'tiptap-extension-collaboration'
import randomColor from 'randomcolor'
import TopBar from './TopBar'

export default {
  name: "CollabEditor",
  components: {
    EditorContent,
    TopBar,
  },

  props: {
    clientID: {
      type: String,
      required: true,
    },

    namespace: {
      type: String,
      required: true,
    },

    room: {
      type: String,
      required: true,
    }
  },

  data() {
    return {
      loading: true,
      pureText: '',
      tags: [],
      editor: new Editor({
        onUpdate:(({ state }) => {
          this.pureText = '';
          let d = JSON.stringify(state.doc);
          this.extractText(JSON.parse(d));
          console.log('pt:', state);
          console.log(this.pureText);
        }),
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new Table(),
          new TableHeader(),
          new TableRow(),
          new TableCell(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new History(),
          new Image(),
          new Collaboration({
            socketServerBaseURL: 'http://localhost:6002',
            namespace: this.namespace,
            room: this.room,
            clientID: this.clientID,

            debounce: 250,
            keepFocusOnBlur: false,

            onConnected: (state) => {
              this.loading = false
              this.pureText = '';
              let d = JSON.stringify(state.doc);
              this.extractText(JSON.parse(d));
              console.log('pt:', state);
              // console.log('pt:', this.pureText);
            },
            onClientsUpdate: ({clientsIDs, clientID}) => {
              this.clientsIDs = clientsIDs
              this.mapClientsToColors(clientID)
              this.makeClientColorStyles()
            },
            onDisconnected: () => {
              this.loading = true
            },
            onSaving: () => {
              this.saving = true
            },
            onResponse: (res) => {
              // console.log(res);
              this.tags = res.Keyterms.split(',');
              console.log(this.tags);
            },
            onSaved: () => {
              setTimeout(() => {
                this.saving = false
              }, 500)
            },
          }),
          new Cursors()
        ],
      }),
      saving: false,
      clientsIDs: [],
      colorsMap: {}
    }
  },
  methods: {
    mapClientsToColors(clientID) {
      this.clientsIDs
        .filter((id) => id !== clientID)
        .filter((id) => !Object.keys(this.colorsMap).includes(id))
        .forEach((id) => {
          this.colorsMap[id] = randomColor()
        })
    },

    makeClientColorStyles() {
      let clientsColorsStyle = document.getElementById('client-colors')
      if (clientsColorsStyle) clientsColorsStyle.remove()
      
      clientsColorsStyle = document.createElement('style')
      clientsColorsStyle.type = 'text/css'
      clientsColorsStyle.id = 'client-colors'

      Object.entries(this.colorsMap).forEach(([clientID, color]) => {
        clientsColorsStyle.innerHTML += `.cursor.client-${clientID}::before { background-color: ${color} }\n`
        clientsColorsStyle.innerHTML += `.selection.client-${clientID} { background-color: ${color}20 }\n`
      })

      document.getElementsByTagName('head')[0].appendChild(clientsColorsStyle)
    },

    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({ src })
      }
    },

    extractText(data) {
      if (Array.isArray(data)){
          return data.forEach((arr) => this.extractText(arr));
      }
      Object.entries(data).forEach(e => {
        if (e[0] === 'content') {
          // console.log(e[1]);
          this.extractText(e[1]);
        }
        else if (e[0] === 'text') {
          this.pureText += e[1];
        }
        // console.log(e);
      })
    }, 

    seg () {
      console.log(this.pureText);
      this.editor.extensions.extensions.find((e) => e.name === 'collaboration').callGaisSegment(this.pureText)
    },

    finalTag (ftag) {
      this.editor.extensions.extensions.find((e) => e.name === 'collaboration').finalTag(ftag)
    },

  },

  beforeDestroy() {
    this.editor.destroy()
    this.editor.extensions.extensions.find((e) => e.name === 'collaboration').closeSocket()
  },
}
</script>

<style scoped>
  .mdpanel {
    margin-left:100px;
    margin-right:100px;
    margin-top:50px;
  }

  ul:not(.browser-default) {
    padding-left: 20px;
    list-style-type: disc;
  }

  ul:not(.browser-default) > li { 
    list-style-type: disc;
  }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

  /*	.editor:focus{
		outline:none;
	}
	.ProseMirror:focus{
		outline:none;
	}*/
.clientsIDs {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #27b127;
  margin-bottom: 1rem;
  text-transform: uppercase;
  font-size: 0.7rem;
  line-height: 1;
}

.savingStatus {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #27b127;
  margin-bottom: 1rem;
  font-size: 0.6rem;
  line-height: 1;
  font-style: italic;
}

.editor {
  position: relative;
  max-width: 30rem;
  margin: 0 auto 5rem auto;

}

.cursor {
  position: relative;
  display: inline-block;
  height: 1.2em
}

.cursor::before {
  content: '';
  display: block;
  width: 2px;
  height: 120%;
  position: absolute;
  top: 0.15em;
  left: -1px;
  z-index: 1;
}

.selection {
  position: relative;
}
</style>
