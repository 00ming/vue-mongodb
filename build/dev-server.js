require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var formidable = require('formidable')
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var ObjectId = require('mongodb').ObjectID
var MongoClient = require('mongodb').MongoClient

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var url = 'mongodb://localhost:27017/aaa'
//插入数据库
app.post("/xie",function(req,res){
  form.parse(req,function(err,fields){
    MongoClient.connect(url,function(err,db){
      if(err){
        console.log("连接失败");
        return
      }
      console.log("连接成功");
      db.collection('user').insertOne({
        "username" : fields.username,
        "password" : fields.password
      }, function(err, result) {
        if(err){
          console.log("插入失败");
          res.json(-1)
          db.close()
          return;
        }
        res.json(1)
        db.close()
      }
    )
  })
  })
})
//删除
app.get("/shan",(req,res) => {
  MongoClient.connect(url,function(err,db){
    if(err){
      console.log("连接失败");
      return
    }
    console.log("连接成功");
    if(req.query.id){
      var id = req.query.id
      db.collection('user').deleteOne({"_id":ObjectId(id)},(err,result) => {
        if(err){
          console.log(err);
          db.close()
          res.json(-1)
          return
        }
      })
      console.log(id)
      res.json(1)
    }
    else {
      var username = req.body.username
      var password = req.body.psd
      db.collection('user').deleteOne({"username":username,"password":password},(err,result) => {
        if(err){
          console.log(err);
          db.close()
          res.json(-1)
          return
        }
      })
      console.log({"username":username,"password":password});
      res.json(1)
    }
  })
})
//读取数据库
app.get("/du",function(req,res){
  MongoClient.connect(url,function(err,db){
    if(err){
      console.log("连接失败");
      return
    }
    console.log("连接成功");
    var result = []
    var cursor = db.collection('user').find({});
    cursor.each(function(err,doc){
      if(err){
        console.log('fail')
        db.close()
        return
      }
      if(doc != null){
        result.push(doc)
      } else {
        res.json(result)
        db.close()
      }
    })
  })
})
//改
app.post("/gai",(req,res) => {
  var form =new formidable.IncomingForm()
  form.parse(req, function(err, fields){
    MongoClient.connect(url,function(err,db){
      if(err){
        console.log("连接失败");
        return
      }
      console.log("连接成功");
      var username = fields.username
      var password = fields.password
      var ousername = fields.ousername
      var opassword = fields.opassword
      var json1 = {"username":username,"password":password}
      var json2 = {"username":ousername,"password":opassword}
      console.log(json1);
      console.log(json2);
      db.collection('user').updateOne(json2,json1,(err,result) => {
        if(err){
          console.log(err);
          db.close()
          res.json(-1)
          return
        }
        console.log(result);
        if(result.result.n == 1){
            res.json(1)
        } else {
            res.json(-1)
        }

      })
    })
  })
})


var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
