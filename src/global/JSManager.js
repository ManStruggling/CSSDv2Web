// JSManager 处理C#和JS交互
import Vue from 'vue';
let VM = new Vue;
/** 接收CS传来的信息
 *   type 消息类型
 *   msg  消息内容
 *   userInfo 用户自定义信息 
 */
let handleDataThis = null; //定位当前组件this

function ReceiveMessage(type, msg, userInfo) {
    type = type == "" || type == undefined ? 'info' : type;
    switch (type) {
        case "Alert": //弹窗提示

            break;
        case "Warning": //警告
            break;
        case "Error": //错误
            VM.$message.error(msg);
            break;
        case "Message": //消息
            VM.$message({
                message: msg,
                center: true,
                showClose: true,
                duration: 2000,
                type: type
            })
            break;
        case "DataImage": //图片数据
            DataImage(type, msg, userInfo);
            break;
        case "OK": //弹窗保存
            break;
        case "Cancel": //弹窗取消
            break;
        case "Close": //弹窗关闭
            break;
        case "Jump": //跳转模块
            break;
        case "Check": //审核
            break;
        case "User": //用户输入条码
            break;
        case "Package": //包条码
            // VM.$alert(msg, '标题名称', {
            //     confirmButtonText: '确定',
            //     callback: action => {
            //         this.$message({
            //             type: 'info',
            //             message: `action: ${ action }`
            //         });
            //     }
            // });
            if (CSManager.handleDataThis && CSManager.handleDataThis.handleBarCode) {
                CSManager.handleDataThis.handleBarCode(msg);
            }
            break;
        case "CleanBasket": //清洗网篮条码
            break;
        case "CleanDevice": //清洗设备条码
            break;
        case "SterilizeBasket": //灭菌网篮
            break;
        case "SterilizeCar": //灭菌车
            break;
        case "SterilizeDevice": //灭菌设备
            break;
        case "BiologicalSterilize": //生物灭菌监测
            break;
        case "ChemicalSterilize": //化学灭菌监测
            break;
        default:
            break;
    }
}
/** 获取本地配置文件及硬件设备信息
*   type 消息类型
*   msg  消息内容
    public class LocalConfigModel{
        public List<string> MediaList;//本地摄像头列表
        public List<string> PrinterList;//本地打印机列表
        public string MediaDefault;//默认摄像头
        public string BarcodePrinterDefault;//默认条码打印机
        public string PaperPrinterDefault;//默认报表打印机
    }
*/
function GetLocalConfig() {
    try {
        var response = JSManager.GetLocalConfig();
        response = JSON.parse(response); //LocalConfigModel
        return response;
    } catch (error) {

    }
}
/** 保存默认设置
 * model  LocalConfigModel   MediaList和PrinterList可以为空数组
 */
function SaveLocalConfig(model) {
    try {
        var msg = JSON.stringify(model);
        JSManager.SaveLocalConfig(msg);
    } catch (error) {

    }
}

/*
 *frequency 刷新频率  单位是毫秒，默认是50毫秒刷新一次  可不填
 *deveice 默认找本地摄像头的第一个  可不填
 *userInfo 用户自定义信息  可以传打开摄像头后展示容器的id
 */
function OpenVideo(frequency, deveice, userInfo) {
    try {
        CSManager.video_this = userInfo; //vue组件this
        JSManager.OpenVideo(frequency, deveice, "");
    } catch (error) {

    }
}
/*
 * 关闭摄像头
 */
function CloseVideo() {
    try {
        JSManager.CloseVideo();
    } catch (error) {

    }
}
/*打印条形码
 * msg 打印内容  PrintModel
 */
function PrintBarcode(msg) {
    try {
        JSManager.PrintBarcode(msg);
    } catch (error) {

    }
}

function PrintPaper(msg) {
    try {
        JSManager.PrintPaper(msg);
    } catch (error) {

    }
}
/*
public class PrintModel
{
    public string Printer { get; set; } //打印机名称  需要设定
    public string PaperType { get; set; } /// 纸张大小 A4 A5 A6 条形码
    public int Num { get; set; }         /// 打印数量
    public string Module{get;set;}        /// 模板文件 package.repx
    public NodeType Node { get; set; }    /// 节点
    public string DataValue { get; set; } /// 打印数据  数据集(例如Array()[PackageForPrint])
}
public enum NodeType
{
    回收,
    清洗消毒,
    清洗审核,
    配包,
    灭菌,
    灭菌审核,
    入库,
    发放,
    使用
}
public class PackageForPrint
{
    public string UserName;
    public string Barcode;
}
*/
function DataImage(type, msg, userInfo) {
    CSManager.video_this.image = msg;
}
let startTime;
let endTime;
let BarCode = "";
let onOff = true;

function ListenKeyDownEvent() {
    $(document).keydown(function(event) {
        if (CSManager.onOff) {
            CSManager.startTime = new Date().getTime();
            CSManager.BarCode = "";
            CSManager.onOff = false;
        }
        if (event.keyCode == 16) {
            return;
        } else if (event.keyCode == 9) {
            CSManager.endTime = new Date().getTime();
            if (CSManager.endTime - CSManager.startTime < 500 && CSManager.BarCode) {
                event.preventDefault();
                ReceiveMessage("Package", CSManager.BarCode);
            }
            CSManager.BarCode = "";
            CSManager.onOff = true;
        } else {
            CSManager.BarCode += event.key;
        }
    })
}
export default {
    startTime,
    endTime,
    BarCode,
    onOff,
    ListenKeyDownEvent,
    ReceiveMessage,
    GetLocalConfig,
    SaveLocalConfig,
    OpenVideo,
    CloseVideo,
    PrintBarcode,
    PrintPaper,
    handleDataThis
}