<template>
  <div>
    <TopBar
      :namespace="namespace"
      :room="room"
      :IDs="clientsIDs"
      :saving="saving">
    </TopBar>
    <div class="mdpanel">
<!--
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          Bold
        </button>
    </editor-menu-bar>
-->
      <template v-if="editor && !loading">
<!--
        <div class="clientsIDs">
          &bull; {{ clientsIDs.length }} {{ clientsIDs.length === 1 ? 'user' : 'users' }} connected to {{ namespace }}/{{ room }}
        </div>
-->
        <editor-content class="editor__content" :editor="editor"  />
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
  Bold,
  Code,
  Italic,
  Link,
  History,
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
 /* data() {
    return {
      editor: new Editor()
    }
  },*/

  props: {
    namespace: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: true,
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new History(),
          new Collaboration({
            socketServerBaseURL: 'http://localhost:6002',
            namespace: this.namespace,
            room: this.room,
            clientID: String(Math.floor(Math.random() * 0xFFFFFFFF)),

            debounce: 250,
            keepFocusOnBlur: false,

            onConnected: () => {
              this.loading = false
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
  /*mounted() {
      this.editor.destroy()
      this.editor = new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new History(),
        ],
        content: `
          <h2>
            Markdown Shortcuts
          </h2>
          <p>
            Start a new line and type <code>#</code> followed by a <code>space</code> and you will get an H1 headline.
          </p>
          <p>
            This feature is called <strong>input rules</strong>. There are some of these shortcuts for the most basic nodes enabled by default. Try <code>#, ##, ###, …</code> for headlines, <code>></code> for blockquotes, <code>- or +</code> for bullet lists. And of course you can add your own input rules.
          </p>
        `,
      })
  },*/
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
