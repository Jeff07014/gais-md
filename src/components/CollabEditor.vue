<template>
  <div style="height:900px">
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
    <div class="mdpanel z-depth-4">
      <template v-if="editor && !loading">
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
          <div class="menubar">

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.bold() }"
              @click="commands.bold"
            >
              <i class="material-icons prefix">format_bold</i>
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.italic() }"
              @click="commands.italic"
            >
              <i class="material-icons prefix">format_italic</i>
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.strike() }"
              @click="commands.strike"
            >
              <i class="material-icons prefix">strikethrough_s</i>
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.underline() }"
              @click="commands.underline"
            >
              <i class="material-icons prefix">format_underlined</i>
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.code() }"
              @click="commands.code"
            >
              <i class="material-icons prefix">code</i>
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.paragraph() }"
              @click="commands.paragraph"
            >
              <i class="material-icons prefix">format_clear</i>
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.heading({ level: 1 }) }"
              @click="commands.heading({ level: 1 })"
            >
              H1
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.heading({ level: 2 }) }"
              @click="commands.heading({ level: 2 })"
            >
              H2
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.heading({ level: 3 }) }"
              @click="commands.heading({ level: 3 })"
            >
              H3
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.bullet_list() }"
              @click="commands.bullet_list"
            >
              <i class="material-icons prefix">format_list_bulleted</i>
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.ordered_list() }"
              @click="commands.ordered_list"
            >
              <i class="material-icons prefix">format_list_numbered</i>
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.blockquote() }"
              @click="commands.blockquote"
            >
              <i class="material-icons prefix">format_quote</i>
            </button>

            <button
              class="btn white menu-btn"
              :class="{ 'is-active': isActive.code_block() }"
              @click="commands.code_block"
            >
              <i class="material-icons prefix">code</i>
            </button>

            <button
              class="btn white menu-btn"
              @click="commands.horizontal_rule"
            >
              <i class="material-icons prefix">remove</i>
            </button>

            <button
              class="btn white menu-btn"
              @click="commands.undo"
            >
              <i class="material-icons prefix">undo</i>
            </button>

            <button
              class="btn white menu-btn"
              @click="commands.redo"
            >
              <i class="material-icons prefix">redo</i>
            </button>

            <button
              class="btn white menu-btn"
              @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
            >
              <i class="material-icons prefix">grid_on</i>
            </button>

            <button
              class="btn white menu-btn"
              @click="showImagePrompt(commands.image)"
            >
              <i class="material-icons prefix">image</i>
            </button>

            <button
              class="btn white menu-btn"
              @click="exportPDF"
            >
              <i class="material-icons prefix">picture_as_pdf</i>
            </button>

          </div>
        </editor-menu-bar>
        <div class="text">
          <EditorContent class="editor__content" :editor="editor"  />
        </div>
      </template>
      <em v-else>
        Connecting to socket server …
      </em>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf"
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
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
  Strike,
  Underline,
} from 'tiptap-extensions'
import {Cursors, Collaboration} from 'tiptap-extension-collaboration'
import randomColor from 'randomcolor'
import TopBar from '../components/TopBar'

export default {
  name: "CollabEditor",
  components: {
    EditorContent,
    TopBar,
    EditorMenuBar,
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
        /*onUpdate:(({ state }) => {
          this.pureText = '';
          let d = JSON.stringify(state.doc);
          this.extractText(JSON.parse(d));
          console.log('pt:', state);
          console.log(this.pureText);
        }),*/
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
          new HorizontalRule(),
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
          new Strike(),
          new Underline(),
          new Collaboration({
            socketServerBaseURL: 'http://127.0.0.1:6002',
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
              // console.log('pt:', state);
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
              this.updateIndex();
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
          clientsColorsStyle.innerHTML += `.cursor.client-${clientID} { border-left: 2px solid ${color}; position:relative }\n.cursor.client-${clientID}:hover .cursor.client-${clientID}-name { position: absolute; bottom: -2rem; display: inline; width:max-content; background-color:${color}; padding:0.2rem; left: -2px; border-radius: 2px}\n.cursor.client-${clientID}-name { display:none }\n `
        // clientsColorsStyle.innerHTML += `.cursor.client-${clientID}::bofore { background-color: ${color} }\n`
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
      console.log(ftag);
      this.editor.extensions.extensions.find((e) => e.name === 'collaboration').finalTag(ftag)
      this.editor.extensions.extensions.find((e) => e.name === 'collaboration').updateIndex({
          'eID': this.elementID,
          'title': this.room,
          'pureText': this.pureText,
          'tags': ftag
      });
    },

    updateIndex () {
    // console.log(this.tags);
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
    margin-left:20%;
    margin-right:20%;
    margin-top:94px;
    padding: 20px;
    border-radius:10px;
    height:85%;
    min-width:850px;
    margin-bottom:500px;
  }

  .text {
    height: 90%;
    overflow-y: scroll;
    overflow-x: hidden;
    word-break: break-word;
    overflow: -moz-scrollbars-none;
  }

  .text::-webkit-scrollbar {
    display: none;
  }

  /* ul:not(.browser-default) > li { 
    list-style-type: disc;
  } */

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
  
  .menu-btn {
    color: black;
  }
</style>
