<template>
  <div class="hello">
    <form >
      <table>
        <tr>
          <td>用户名：</td><td><input type="text" name="" value="" v-model="username"></td>
        </tr>
        <tr>
          <td>密码：</td><td><input type="password" name="" value="" v-model="psd"></td>
        </tr>
        <tr>
          <td><button type="button" name="button" @click="reg">添加用户表</button></td><td></td>
        </tr>
      </table>
    </form>
    <br>
    <table>
      <tr>
        <th>用户名：</th><th>密码：</th><th>操作</th>
      </tr>
      <tr v-for="(item,index) in user">
        <td>{{item.username}}</td><td>{{item.password}}</td><td><button type="button" @click="de(item,index)">删除</button><button type="button" name="button" @click="change(item,index)">修改</button></td>
      </tr>
    </table>

  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      username:'',
      psd:'',
      user: []
    }
  },
  created(){
    window.axios.get('/du').then((res) => {
      // console.log(res);
      this.user = res.data;
    })
  },
  methods: {
    reg:function () {
      var name = this.username
      var psd = this.psd
      window.axios.post('/xie',{
        "username": name,
        "password": psd
      }).then((res) => {
        console.log(res)
        var a = {"username":name,"password":psd}
        this.user.push(a);
        this.username = this.psd =''
      }).catch((err) => {
        console.log(err);
      })
    },
    de:function(item,index){
      var _this=this
      if(item._id){
        window.axios.get("/shan?id="+item._id).then((res) => {
          console.log(res)
          _this.user.splice(index,1)
          console.log(_this.user);
          console.log(1);
        }).catch((err) => {
          console.log(err);
        })
      } else {
        console.log("/shan?username=" + item.username + "&psd=" + item.password);
        window.axios.get("/shan?username=" + item.username + "&psd=" + item.password).then((res) => {
          console.log(res);
            _this.user.splice(index,1)
            console.log(1);
        }).catch((err) => {
          console.log(err);

        })
      }
    },
    change:function(item,index){
      var name = this.username
      var psd = this.psd
      var oname = item.username
      var opsd = item.password

      window.axios.post("/gai",{
        "username": name,
        "password": psd,
        "ousername": oname,
        "opassword": opsd
      }).then((res) => {
        console.log(res.data);
        if(res.data != 1){
          console.log("修改失败");
          return
        }
        console.log("修改成功");
        item.username = name
        item.password = psd
      }).catch((err) => {
        console.log(err);
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
