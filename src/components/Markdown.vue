<template>
  <div class="row" style="margin:50px">
      <div class="inputpanel col">
        <textarea class="textfield" type="text" v-model="cont" value="input"></textarea>
	      <!--
	<div class="textfield" contenteditable="true" v-model="cont" ></div>
	      -->
      </div>
      <div class="mdpanel col">
	<markdown-it-vue style="width:100%" class="md-body col" :content="cont" />
      </div>
  </div>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
export default {
  name: 'Markdown',
  components: {
    MarkdownItVue,
  },
  props: {
    cont: String
  }
}
</script>

<style>
	.inputpanel{
		width:40%;
		box-shadow:0px 0px 4px 0px black;
		border-radius:0.5rem;
		margin-right:50px;
	}

	.mdpanel{
		width:40%;
		height:700px;
		/*box-shadow:0px 0px 10px 0px black;
		border-radius:0.5rem;
		margin-right:50px;*/
	}

	.textfield{
		height:700px;
		width:100%;
		border:0;
		background:white;
		resize:none;
		padding-top:10px;
	}

	.textfield:focus{
		outline:none;
	}
</style>
