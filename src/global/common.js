exports.install = function(Vue, options) {
    Vue.prototype.baseDataSearch = function(url) { //全局函数1
        axios({ url: url }).then(res => {
            this.table_data = res.data.value;
        }).catch(err => {
            console.log(err)
        })
    };
    Vue.prototype.text2 = function() { //全局函数2
        alert('执行成功2');
    };
    // Vue.prototype.restore = function(str) { //全局函数3
    //     str = str.replace(/(^\s*)|(\s*$)/g, "");
    //     return str;
    // };
};