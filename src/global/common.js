exports.install = function(Vue, options) {
    Vue.prototype.baseDataSearch = function(url) { //全局函数1
        axios({ url: url }).then(res => {
            this.table_data = res.data.value;
        }).catch(err => {
            console.log(err)
        })
    };
};