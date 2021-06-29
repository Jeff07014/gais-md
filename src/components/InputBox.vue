<template>
  <div>
    <div id="inputBox">
        <span> TestText:</span>
        <p style="white-space: pre-line;">{{ message }}</p>
        <br />
        <textarea v-model="message" placeholder="add multiple lines"></textarea>
        <button v-on:click="keyword">submit</button>
        <button v-on:click="clean">clean</button>
    </div>
    <div id="types">
  {{types}}
    </div>
    <div id="chooseBox" v-for="(type, index) in types"
                        v-bind:key="index" >
      <!-- <label :for="type"> -->
      <label>
        <input type="checkbox" :id="index" :value="type" v-model="checked">
        <span>{{ type }}</span>
      </label>
    </div>
    <div id="checked">
  {{checked}}
        <button v-on:click="cleanChoose">cleanChoose</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InputBox',
    data() {
      return {
        message: '近日各大網站、通訊軟體廣傳「日本外相在國會被問到為何只給臺灣124萬，說臺灣政府沒想要很多，只要六月擋一下就好，七月以後就有國產疫苗就足夠」等疫情謠言說法，傳送訊息者並附上日本外相國會被質詢之新聞連結或影片，該訊息經外交部與疾管署等機關認定為不實內容，刑事局電信偵查大隊第一隊8日獲報後，與北市警察局、新竹縣警察局等單位共組專案小組，追查假訊息來源。根據警方調查並進行網路影音訊息蒐證，發現此假訊息最早從巴哈姆特網站由網友撰文發布，後續再透過臉書推特等社群、及手機通訊軟體不斷傳遞。其中國民黨籍新竹縣副縣長陳見賢也帶頭轉傳給其他民眾遭到檢舉，8日立法院民進黨團亦針對此事件要求國民黨主席江啟臣道歉，並引發媒體大幅報導。',
types: [],
checked: []
      }
    },
    methods: {
      keyword() {
        this.$http.get('http://gaisdb.ccu.edu.tw:5721/api/segment?content='+this.message).then((response) => {
            this.types=response.data.Keyterms.split(',');
        });
      },
      clean(){
this.types=[];
this.checked=[];
},
cleanChoose(){
this.checked=[];
}
    }
  }
</script>
