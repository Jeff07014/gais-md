<template>
  <div>
    <TopBar
      @seg="seg"
      @finalTag="finalTag"
      @updateIndex="updateIndex"
      @commitIndex="commitIndex"
      :namespace="namespace"
      :room="room"
      :IDs="clientsIDs"
      :tags="tags"
      :saving="saving">
    </TopBar>
    <div class="mdpanel">
      <template v-if="editor && !loading">

        <editor-menu-bar :editor="editor" v-slot="{ commands }">
        <div class="menubar">
            <a class="menubar__button waves-effect waves-light btn" @click="showImagePrompt(commands.image)">
                image
            </a>
            <a class="waves-effect waves-light btn" @click="exportPDF">export</a>
        </div>
        </editor-menu-bar>

        <EditorContent id="mainArea" class="editor__content" :editor="editor"  />
      </template>
      <em v-else>
        Connecting to socket server …
      </em>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf";

import { Editor, EditorContent, EditorMenuBar} from 'tiptap'
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

  HorizontalRule,
  Strike,
  Underline,
} from 'tiptap-extensions'
import {Cursors, Collaboration} from 'tiptap-extension-collaboration'
import randomColor from 'randomcolor'
import TopBar from './TopBar'

export default {
  name: "CollabEditor",
  components: {
    EditorContent,
    EditorMenuBar,
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
    },
    
    elementID: {
      type: String,
      required: true,
    },

    tags: {
        type: Array
    },
  },

  data() {
    return {
      loading: true,
      pureText: '',
      editor: new Editor({
        onUpdate:(({ state, getJSON, getHTML }) => {
          this.pureText = '';
          let d = JSON.stringify(state.doc);
          this.extractText(JSON.parse(d));
          /*console.log('pt:', state);*/
          /*console.log(this.pureText);*/
          this.json = getJSON();
          this.html = getHTML();
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

          new HorizontalRule(),
          new Strike(),
          new Underline(),

          new Collaboration({
            socketServerBaseURL: 'http://140.123.101.148:6002',
            namespace: this.namespace,
            room: this.room,
            clientID: this.clientID,
            elementID: this.elementID,

            debounce: 250,
            keepFocusOnBlur: false,

            onConnected: (state) => {
              this.loading = false
              this.pureText = '';
              let d = JSON.stringify(state.doc);
              this.extractText(JSON.parse(d));
              /*console.log('pt:', state);*/
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
              }, 500);
              /*console.log(this.tags);*/
              this.updateIndex();
            },
          }),
          new Cursors()
        ],
      }),
      saving: false,
      clientsIDs: [],
      colorsMap: {},
      json: '',
      html: '',
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

    exportPDF() {
        html2canvas(document.getElementById('mainArea')).then(function(canvas) {
            /*document.body.appendChild(canvas);*/
            var pageData = canvas.toDataURL('image/jpeg', 1.0);
            var pdf = new jsPDF('', 'pt', 'a4');
            pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/canvas.width * canvas.height );
            /*pdf.addImage(pageData, 'JPEG', 10, 10);*/
            pdf.save('stone.pdf');
        });
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

    updateIndex () {
      this.editor.extensions.extensions.find((e) => e.name === 'collaboration').updateIndex({
          'eID': this.elementID,
          'title': this.room,
          'pureText': this.pureText,
          'tags': this.tags
      });
    },

    commitIndex () {
      this.editor.extensions.extensions.find((e) => e.name === 'collaboration').commitIndex()
    }

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
