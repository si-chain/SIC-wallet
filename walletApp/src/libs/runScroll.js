/*eslint-disable */
/* jshint ignore:start */
let runScroll = function (options) {
  this.options = options;
  this.el = document.getElementById(this.options.el);
};

runScroll.prototype.scroll = function () {
  if (this.el.scrollTop == 0) {
    this.el.scrollTop = 1;
  };
  this.el.onscroll = function () {
    //由于部分设备中scrollTop与clientHeight之和不完全等于scrollHeight（一般会少于），因此+1再判断是否大于等于。
    console.log(this.scrollTop, this.clientHeight)
    if (this.scrollTop + this.clientHeight + 1 >= this.scrollHeight) {
      this.scrollTop = this.scrollHeight - this.clientHeight - 1;
    } else if (this.scrollTop == 0) {
      this.scrollTop = 1;
    };
  };
};
export default runScroll;
