<template>
  <div>
    <TopBar/>
    <CollabEditor
      :namespace="namespace"
      :room="room"
      :clientID="clientID"
    />
  </div>
</template>

<script>
import TopBar from './TopBar.vue'
import CollabEditor from './CollabEditor.vue'

export default {
  name: "MainEditor",
  components: {
    TopBar,
    CollabEditor
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

    clientID: {
      type: String,
      required: true,
    },

  }
}
</script>
