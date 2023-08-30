// pages/game/game.js
// 方块的初始位置
var num = [
  ['00', '01', '02'],
  ['10', '11', '12'],
  ['20', '21', '22']
]
 
// 方块的宽度
var w = 100
 
// 图片的初始地址
var url = '/images/pic01.jpg'
 
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    isWin: false
 
  },
 
  /**
   * 自定义函数--随机打乱方块顺序
   */
  shuffle: function() {
    // 先令所有方块回归初始位置
    num = [
      ['00', '01', '02'],
      ['10', '11', '12'],
      ['20', '21', '22']
    ]
 
    // 记录当前空白方块的行和列
    var row = 2
    var col = 2
 
    // 随机打乱方块顺序100次
    for (var i = 0; i < 100; i++) {
      // 随机生成一个方向：上0,下1,左2,右3
      var direction = Math.round(Math.random() * 3)
 
      // 上：0
      if (direction == 0) {
        // 空白方块不能在最上面一行
        if (row != 0) {
          // 交换位置
          num[row][col] = num[row - 1][col]
          num[row - 1][col] = '22'
 
          // 更新空白方块的行
          row -= 1
        }
      }
 
      // 下：1
      else if (direction == 1) {
        // 空白方块不能在最下面一行
        if (row != 2) {
          // 交换位置
          num[row][col] = num[row + 1][col]
          num[row + 1][col] = '22'
 
          // 更新空白方块的行
          row += 1
        }
      }
 
      // 左：2
      else if (direction == 2) {
        // 空白方块不能在最左边一列
        if (col != 0) {
          // 交换位置
          num[row][col] = num[row][col - 1]
          num[row][col - 1] = '22'
 
          // 更新空白方块的列
          col -= 1
        }
      }
 
      // 右：3
      else if (direction == 3) {
        // 空白方块不能在最右边一列
        if (col != 2) {
          // 交换位置
          num[row][col] = num[row][col + 1]
          num[row][col + 1] = '22'
 
          // 更新空白方块的列
          col += 1
        }
      }
 
    }
 
  },
 
  /**
   * 自定义函数--绘制画布内容
   */
  drawCanvas: function() {
    let ctx = this.ctx
 
    // 清空画布
    ctx.clearRect(0, 0, 300, 300)
 
    // 使用双重for循环语句绘制3x3拼图
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (num[i][j] != '22') {
          // 获取行和列
          var row = parseInt(num[i][j] / 10)
          var col = num[i][j] % 10
 
          // 绘制方块
          ctx.drawImage(url, col * w, row * w, w, w, j * w, i * w, w, w)
        }
      }
    }
 
    ctx.draw()
  },
 
  touchBox:function (e) {
    //游戏已经成功，则终止本函数
    if(this.data.isWin)
    {
      return
    }
    var x=e.changedTouches[0].x
    var y=e.changedTouches[0].y
    var row=parseInt(y/w)
    var col=parseInt(x/w)
    if(num[row][col]!='22'){
      this.moveBox(row,col)
      this.drawCanvas()
      if(this.isWin()){
        let ctx=this.ctx
        ctx.drawImage(url,0,0)
        ctx.setFillStyle('#e64340')
        ctx.setTextAlign('center')
        ctx.setFontSize(60)
        ctx.fillText('游戏成功',150,150)
        ctx.draw()
      }
    }
  },
      
  
  /**
   * 移动被点击的方块
   */
  moveBox:function(i,j){
    //检查是否可以上移
    if(i>0){
      if(num[i-1][j]=='22'){
        //交换空白方块与被点击方块的位置
        num[i-1][j]=num[i][j]
        num[i][j]='22'
        return
      }
    }
    //检查是否可以下移
    if(i<2){
      if(num[i+1][j]=='22'){
        //交换空白方块与被点击方块的位置
        num[i+1][j]=num[i][j]
        num[i][j]='22'
        return
      }
    }
    //检查是否可以左移
    if(j>0){
      if(num[i][j-1]=='22'){
        //交换空白方块与被点击方块的位置
        num[i][j-1]=num[i][j]
        num[i][j]='22'
        return
      }
    }
    //检查是否可以下移
    if(j<2){
      if(num[i][j+1]=='22'){
        //交换空白方块与被点击方块的位置
        num[i][j+1]=num[i][j]
        num[i][j]='22'
        return
      }
    }
  },
  /**
   * 判断游戏是否成功
   */
  isWin:function(){
    //遍历数组 查看是否都正确
    for(var i=0;i<3;i++)
    {
      for(var j=0;j<3;j++)
      {
        if(num[i][j]!=i*10+j){
          return false
        }
      }
    }
    this.setData({
      isWin:true
    })
    return true
  },
   /**
   * 重新开始游戏
   */
  restartGame:function(){
    this.setData({isWin:false})
    this.shuffle()
    this.drawCanvas()
  },
  /**
   * 自定义函数--监听点击方块事件
   */
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options.level)
 
    // 更新图片路径地址
    url = '/images/' + options.level
    // 更新提示图的地址
    this.setData({
      url: url
    })
 
    // 创建画布上下文
    this.ctx = wx.createCanvasContext("myCanvas")
 
    // 打乱方块顺序
    this.shuffle()
 
    // 绘制画布内容
    this.drawCanvas()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
 
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
 
  },
 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
 
  },
 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
 
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
 
  },
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
 
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
 
  }
})