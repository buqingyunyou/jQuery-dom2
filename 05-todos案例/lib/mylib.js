  // 隐藏main和footer,并添加h4标签
  function hideMainFooter() {
    // (1)让main和footer隐藏
    $('.todo-main, .todo-footer').hide();
    // (2)添加h4元素
    $('.todo-wrap').append('<h4>暂时没有任务..</h4>')
  }

  // 展示main和footer,并移除h4标签
  function showMainFooter() {
    // (1)让main和footer展示
    $('.todo-main, .todo-footer').show();
    // (2)移除h4元素
    $('.todo-wrap h4').remove();
  }

  // 是否展示main和footer
  function isShowMainFooter() {
    // 根据main下是否有子元素, 执行展示, 或者隐藏
    $('.todo-main').children().length ? showMainFooter() : hideMainFooter()
  }

  // 修改全选状态
  function ChangeAllStatus() {
    // (1)获取选中的任务项个数
    var checkedItems = $('.todo-main>li>label>input:checked').length;
    // (2)获取所有的任务项个数
    var allItems = $('.todo-main>li>label>input').length;
    // (3)如果相等, 则让全选框选中, 否则让全选框不选中
    checkedItems === allItems ? $('.todo-footer input').prop('checked', true) : $('.todo-footer input').prop('checked', false)
  }

  // 动态修改展示的任务项选中个数, 和所有任务个数
  function calcaNum() {
    // (1)获取选中的任务项的个数
    var len = $('.todo-main input:checked').length;
    // (2)获取列表中所有的任务项的个数
    var total = $('.todo-main input').length;
    // (3)将其拼接到html字符串中
    var str = ' <span>已完成' + len + '</span> / 全部' + total + ' ';
    // (4)将html字符串设置为span的内容
    $('.todo-footer>span').html(str);
  }