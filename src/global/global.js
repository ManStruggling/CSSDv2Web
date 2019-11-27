import Vue from 'vue';
import * as signalR from "@aspnet/signalr";
let TipsMsg = new Vue(); //显示验证消息

function send() {
    //alert(JSManager);
    JSManager.ShowMsg("Hello C#,我需要打印条码");
}

function testPrint() {
    var list = new Array();
    var model = {
        Barcode: "801903030001",
        UserName: "张三"
    };
    list.push(model);

    JSManager.TestPrint(JSON.stringify(list));
}

function GetPrinterList() {
    var response = JSManager.GetPrinterList();
    response = JSON.parse(response);
    alert(response);
}

function GetMediaList() {
    var response = JSManager.GetMediaList();
    response = JSON.parse(response);
    alert(response);
}

function OpenMedia() {
    JSManager.OpenVideo();
}

function CloseMedia() {
    JSManager.CloseVideo();
}

function updateImage(img) {
    document.getElementsByTagName('img')[0].src = img;
}

//产品字典
let ProductDictionary = {
    80: "追溯的无菌包",
    81: "外来器械包",
    82: "高水平消毒包",
    83: "追溯的辅料包",
    84: "一次性物品",
    85: "代消包"
}

//设备字典
let DeviceDictionary = { //灭菌设备 = 0,清洗设备 = 1
    0: "灭菌设备",
    1: "清洗设备"
}

function getTimeStamp(str) {
    let arr = str.split(':');
    let hour = arr[0];
    let minute = arr[1];
    let seconds = arr[2];
    return (hour * 60 * 60 + minute * 60 + seconds) * 1000;
}
//transform to view format
function formatDuring(mss) {
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (mss % (1000 * 60)) / 1000;
    hours = hours < 10 ? ('0' + hours) : hours;
    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    seconds = seconds < 10 ? ('0' + seconds) : seconds;
    return hours + ":" + minutes + ":" + seconds;
}
//record search date format yyyy-mm-dd
function GetNowDate() {
    let myDate = new Date();
    let year = myDate.getFullYear();
    let m = myDate.getMonth() + 1;
    let month = m < 10 ? "0" + m : m;
    let d = myDate.getDate();
    let day = d < 10 ? "0" + d : d;
    return `${year}-${month}-${day}`;
}
//record search request        start开始日期   end结束日期   _this组件实例   apiUrl接口  fileName日期筛选字段名    callback回调  extra额外
function searchRecord(start, end, _this, apiUrl, fileName, callback, extra) {
    let url;
    if (extra) {
        url = `${apiUrl}?$filter=${fileName} ge '${start +" 00:00"}' and ${fileName} le '${end + " 23:59"}' and ${extra}`
    } else {
        url = `${apiUrl}?$filter=${fileName} ge '${start +" 00:00"}' and ${fileName} le '${end + " 23:59"}'`
    }
    axios(url)
        .then(res => {
            _this.recordList = res.data.value;
            TipsMsg.$message({
                center: true,
                message: "查询成功",
                duration: 2000,
                type: "success",
                showClose: true
            })
            showInformation({ type: "success", msg: "查询成功" });
            //存在回调函数并且记录不能为空才执行
            if (callback && _this.recordList.length > 0) {
                callback();
            }
        })
        .catch(err => {});
}
//验证
function Verification(obj) {
    let correct = { bool: true, msg: obj.msg };
    let error = { bool: false, msg: obj.msg };
    switch (obj.type) {
        case "StringNotEmpty": //string不能为空
            return obj.val === "" ? error : correct;
        case "ValueNotEmptyAndNotNull":
            return obj.val === "" || obj.val === null ? error : correct;
        case "StringAllNotEmpty": //string都不能为空
            for (let i = 0; i < obj.val.length; i++) {
                if (obj.val[i] === '') {
                    error.msg = obj.msg[i];
                    return error;
                }
            }
            return correct;
        case "NumberNotZero": //number不为0
            return obj.val === 0 ? error : correct;
        case "NumberIsPositive": //number为正整数
            return obj.val > 0 ? correct : error;
        case "NumberAllCannotBeZero": //number全部不能为0
            for (let i = 0; i < obj.val.length; i++) {
                if (obj.val[i] === 0) {
                    error.msg = obj.msg[i];
                    return error;
                }
            }
            return correct;
        case "ArrayNotEmpty": //数组不能为空
            return obj.val == "" ? error : correct;
        case "ArrayAllNotEmpty": //多个数组都不能为空
            for (let i = 0; i < obj.val.length; i++) {
                if (obj.val[i] == "") {
                    error.msg = obj.msg[i];
                    return error;
                }
            }
            return correct;
        case "AccountOrPassword": //账号密码
            if (/^\w+$/.test(obj.val)) {
                return correct;
            } else {
                return error;
            }
        default:
            return { bool: false, msg: "验证类型错误!" };
    }
}
//验证处理   eg:arr=[{val:'test',type:'StringNotEmpty',msg:'xxxx'}]
function VerificationHandle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let obj = Verification(arr[i]);
        if (obj.bool == false) {
            let msg;
            if (Object.prototype.toString.call(arr[i].msg) == "[object Array]") {
                msg = obj.msg;
            } else {
                msg = arr[i].msg;
            }
            TipsMsg.$message({
                type: 'error',
                message: msg,
                duration: 2000,
                center: true,
                showClose: true
            });
            return false;
        }
    }
    return true;
}

let UId = 0;

//退出登录
function logOut() {
    sessionStorage.userInfo = "";
    window.location.href = "/login";
}

//时间范围选择器配置
let pickerOptions = {
    shortcuts: [{
            text: "最近一周",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
            }
        },
        {
            text: "最近一个月",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
            }
        },
        {
            text: "最近三个月",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
            }
        }
    ]
}

//消息提示
function showInformation(option) {
    option.duration = option.duration === undefined ? 2000 : option.duration;
    option.center = option.center === undefined ? true : option.center;
    option.type = option.type === undefined ? "error" : option.type;
    option.showClose = option.showClose === undefined ? true : option.showClose;
    option.dangerouslyUseHTMLString === undefined ? false : option.dangerouslyUseHTMLString;
    switch (option.classify) {
        case "message":
            TipsMsg.$message({
                type: option.type,
                message: option.msg,
                duration: option.duration,
                center: option.center,
                showClose: option.showClose,
                dangerouslyUseHTMLString: option.dangerouslyUseHTMLString
            });
            break;
        case "notify":
            TipsMsg.$notify({
                type: option.type,
                title: '通知',
                message: option.msg,
                duration: option.duration,
            })
            break;
        default:
            break;
    }
}

//初始化websocket
function initWebSorcket(that, origin) {
    that.connection = new signalR.HubConnectionBuilder()
        .withUrl("/api/hubtest")
        .configureLogging(signalR.LogLevel.Information)
        .build();
    that.connection.start();
    that.connection.on("taskUpdateReminder", data => {
        if (typeof data == "object" && origin && that.GLOBAL.UserInfo.ClinicId === data.CssdId) {
            that.hasNewTask = data[origin];
        }
    });
}

//是否启用websocket
function useWebsocketOrNot(that, origin) {
    if (sessionStorage.configure) {
        this.initWebSorcket(that, origin);
    } else {
        return false;
    }
}

//取消事件冒泡
function cancelBubble() {}

//获取地址栏参数
function getParams(key) {
    let arr = window.location.search.substr(1).split("&");
    let obj = {};
    arr.forEach(val => {
        obj[val.split("=")[0]] = val.split("=")[1];
    })
    return obj[key];
}

//时间格式化
function timeFormatDuring(timeSeconds) {
    var hours = parseInt((timeSeconds % (60 * 60 * 24)) / (60 * 60));
    var minutes = parseInt((timeSeconds % (60 * 60)) / 60);
    var seconds = timeSeconds % 60;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds;
}

Vue.prototype.showInformation = showInformation;

export default {
    timeFormatDuring,
    useWebsocketOrNot,
    getParams,
    initWebSorcket,
    cancelBubble,
    pickerOptions,
    logOut,
    ProductDictionary,
    DeviceDictionary,
    send,
    UId,
    OpenMedia,
    CloseMedia,
    updateImage,
    getTimeStamp,
    formatDuring,
    GetNowDate,
    searchRecord,
    VerificationHandle
}