# gallery-by-react

`react` `webpack` `yeoman` `npm`
---
## 开发此项目时所做的准备
配置本地环境，安装yeoman：

    npm install -g yo

查看安装的yeoman版本：`yo --version`

安装需要的generator，可在yeoman官网搜索查看都有哪些安装需要的generator，本项目是基于webpack和react，故执行以下命令：`npm install -g generator-react-webpack`
确认安装了generator的包list：

    npm ls -g --depth=1 2>/dev/null | grep generator-

首先在github创建新项目，进入本地的workfile，拉取项目

    git clone 项目地址
拉取完成后进入项目目录，执行：`yo react-webpack 项目名` 来生成项目，为了方便调试，请安装chrome的工具：“react developer tool”。

## 运行代码

    npm init
    npm run start
浏览器打开：localhost:8000
项目在线浏览地址：https://sylvanase.github.io/gallery-by-react/
其他的npm命令请查看package.json

## 踩过的坑

 - js中需要引入react-dom，否则在取子元素时，单纯使用this.refs.会找不到dom节点，父元素则可以正常获取，尚未搞清是为啥…… 建议使用ReactDOM.findDOMNode()来获取dom节点。
 - 执行时页面可正常显示，但是控制台警告‘Each child in an array or iterator should have a unique “key” prop’，在组件中加入key={index}即可，而且可以提高效率。
 - 注意Math.ceil/Math.floor的区别。
 - 在配置中加入了loader：json-loader，但是读取json文件时仍报错，未找到文件，修改了引用方式采用require引入。
 - 页面发布时，要修改publicPath路径，否则会出现图片文件加载失败问题。

