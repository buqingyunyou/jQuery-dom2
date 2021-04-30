window.addEventListener('DOMContentLoaded', function () {
  // 模拟后台数据
  var dataList1 = [{
      id: 1,
      todoName: "玩",
      isDone: true,
    },
    {
      id: 2,
      todoName: "游",
      isDone: true,
    },
    /*  {
       id:3,
       todoName:"敲代码",
       isDone:false,
     } */
  ]
  /* 
   > map函数,     是一个迭代函数, 具有返回值, 返回一个数组(数组长度和迭代次数相等)
   > forEach函数, 单纯循环迭代,   没有返回值
  */

  // 功能1: 页面初始化加载数据 (动态渲染后台数据)
  // 先判断后台数据是否为空, 
  if (dataList1.length) {
    // 如果不为空, 则渲染
    // (1)根据数据,动态生成html结构字符串
    var htmlArr = dataList1.map(function (item) {
      // 根据后台数据中任务状态isdone值的不同, 进行不同的渲染
      if (item.isDone) {
        /* 
          注意: 因为需要生成的html结构是固定不变的, 所以可将 [html字符串整体] 作为数组的元素, 并将后台数据对应的值动态拼接到字符串中即可
        */
        // a. 如果isdone=true, 则加checked属性, 加标签属性class=done
        return '<li><label><input type="checkbox" checked /><span class="done">' + item.todoName + '</span></label><button class="btn btn-danger">删除</button></li>'
      } else {
        // b. 如果isdone=false, 则不加checked属性, 不加标签属性class=done
        return '<li><label><input type="checkbox" /><span>' + item.todoName + '</span></label><button class="btn btn-danger">删除</button></li>'
      }
    })
    // (2)将html结构字符串, 添加到todo-main元素中(注意数组转字符串)
    var oToDoMain = document.querySelector('#root .todo-main')
    // 错误点: 此处使用的是原生JS, 使用dom的innerHTML属性设置, 不是使用jQuery的html()方法
    oToDoMain.innerHTML = htmlArr.join("");
    // (3)调用 [修改全选函数], 确定全选框是否选中
    ChangeAllStatus();
    // (4)调用 [修改任务项个数/选中任务项个数] 的函数, 确定展示的个数
    calcaNum();
  } else {
    // 如果为空, 则隐藏   (调用自定义的隐藏函数, 将main和footer隐藏, 并添加h4标签)
    hideMainFooter();
  }

  // 功能2: 将todo-header输入的任务, 添加到todo-main中  (给todo-input注册keyup事件)
  $('.todo-header input').on('keyup', function (e) {
    // (1)判断按下抬起的键, 是否为回车键(回车键的keyCode为13) 
    if (e.keyCode === 13) {
      // 如果是回车键
      // a.获取输入的任务名称
      var value = $('.todo-header input').val().trim(); //注意:去除前后空格
      // b.清空input输入框
      $('.todo-header input').val(''); // value值已经用变量保存起来, 此时将input的value值清空
      // c.健壮性代码(排除空值提交情况)
      if (!value) return //如果分支结构的某个分支, 只有一条语句时, 可以不写大括号, 直接将该语句写在if后面即可
      // d.动态添加html字符串
      var str = '<li><label><input type="checkbox" /><span>' + value + '</span></label><button class="btn btn-danger">删除</button></li>'
      $('.todo-main').append(str); //不能html,因为此处不能覆盖, 只能在末尾添加
      // e.展示main和footer
      showMainFooter();
      // f.确定全选框是否选中
      ChangeAllStatus();
      // g.确定选中任务个数和总任务个数
      calcaNum();
    }
  })

  // 功能3: 点击任务项按钮, 修改css样式,全选框状态,选中任务个数和总任务个数 (获取当前任务项的checked属性,如果是选中,则给span添加类done,否则,移除done)
  $('.todo-main').on('click', 'li>label>input', function () {
    // (1)获取当前任务项是否选中的状态
    var isChecked = $(this).prop('checked');
    // (2)根据选中与否, 进行不用css样式设置
    if (isChecked) {
      // 如果选中, 让兄弟元素添加类done,应用对应的css样式
      $(this).next().addClass('done');
    } else {
      // 如果未选中, 让兄弟元素移除类done,应用默认的css样式
      $(this).next().removeClass('done');
    }
    // (3)确定全选框状态
    ChangeAllStatus();
    // (4)确定任务选中个数和总任务个数
    calcaNum();

  })

  // 功能4: 点击全选按钮, 修改任务项选中状态 (若全选框选中, 则让所有任务项都选中; 否则, 让所有任务项都不选中)
  $('.todo-footer input[type=checkbox]').on('click', function () {
    // (1)获取全选框的状态
    var isChecked = $(this).prop('checked')
    // (2)根据全选框状态, 让所有任务项: a.都选中并添加类done; b.都不选中并移除类done
    isChecked ? ($('.todo-main>li>label>input').prop('checked', isChecked).next().addClass('done')) : ($('.todo-main>li>label>input').prop('checked', isChecked).next().removeClass('done'));
    // (3)确定任务项个数和总任务个数
    calcaNum();
  })


  // 功能5: 点击删除按钮(btn-danger),删除当前行任务  (将当前所在li删除, 并判断删除后是否还有li, 如果没有,则将todo-main和todo-footer隐藏, 并添加h4)
  $('.todo-main').on('click', 'button.btn-danger', function () {   //使用事件代理方式, 自动为将来添加的删除按钮添加事件
    // (1)删除当前所在li元素
    $(this).parent().remove();
    // (2)判断当前任务列表 (todo-main)中是否已经没有li, 调用自定义函数, 确定是否展示main和footer
    isShowMainFooter();
    // (3)任务项全部删除后,如果新添加任务, 需要确定全选框状态
    ChangeAllStatus();
    // (4)确定任务项选中个数和总任务个数
    calcaNum();
  })

  // 功能6: 点击删除选中任务按钮(todo-footer中的btn-danger)  (将任务列表中todo-main中的已完成任务清除掉)
  $('.todo-footer .btn-danger').on('click', function () {
    // (1)将已完成任务清除掉
    $('.todo-main input:checked').parent().parent().remove();
    // (2)确定是否要隐藏main和footer
    isShowMainFooter();
    // (3)确定当前任务选中个数和总任务个数
    calcaNum();
  })

})