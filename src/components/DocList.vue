<template>
  <div style="text-align:center">
    <div>
      <h1>{{ clientID }}</h1>
    </div>
    <div class="row">
      <div v-for="doc in doclist" :key="doc.id" class="docs col s4"><button @click="getDoc(doc)" class="doc btn-large">{{ doc.room }}</button></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocList',
  props: {
    clientID: {
      type: String,
      required: true,
    }
  },

  data () {
    return {
      doclist: [
        { namespace: "namespace1/project1", room: "doc1" },
        { namespace: "namespace1/project1", room: "doc2" },
        { namespace: "namespace1/project1", room: "doc3" },
      ]
    }
  },

  methods: {
    getDoc (doc) {
      this.$emit('getDoc', doc.namespace, doc.room);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.docs {
  margin-top:20px;
  height:80px;
}

.doc {
  width:50%;
  height:inherit;
}
</style>
