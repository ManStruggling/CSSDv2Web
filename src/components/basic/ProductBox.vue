<template>
<!-- 产品弹出框 -->
<div id="editBox">
    <div class="editContainer">
        <div class="editContent EditBoxContentOfProduct table_unExpand">
            <el-tabs class="productAttributes">
                <el-tab-pane label="基本信息" name="0">
                    <ul class="clear_float ul_form_style">
                        <li>
                            <p>包名称</p>
                            <el-input type="text" placeholder="包名称(必填)" v-model.trim="editBoxData.Name" maxlength="10"></el-input>
                        </li>
                        <li>
                            <p>拼音简码</p>
                            <el-input type="text" v-model="editBoxData.ShortCode" :disabled="editBoxData.Id==0"></el-input>
                        </li>
                        <li>
                            <p>外包装</p>
                            <el-select v-model="editBoxData.ExternalPackage" placeholder="请选择(必选)" class="green24x13">
                                <el-option v-for="item in optionExternalPackageList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </li>
                        <li v-if="editBoxData.Type!=85&&editBoxData.Type!=81">
                            <p>总条码包数量</p>
                            <el-input-number v-model="editBoxData.HowManyProductsPrintATotalBarCode" :min="0" :max="999" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'HowManyProductsPrintATotalBarCode')})"></el-input-number>
                        </li>
                        <li>
                            <p>发放供应室</p>
                            <el-select v-model="editBoxData.ProvideCssdId" placeholder="请选择(必选)" class="green24x13">
                                <el-option v-for="item in optionCssdList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <p>{{editBoxData.Type==81?'发放科室':'所属科室'}}</p>
                            <el-cascader expand-trigger="hover" :options="optionClinicList" v-model="selectedOptions" @change="handleChange" placeholder="请选择(必选)"></el-cascader>
                        </li>
                        <li v-if="editBoxData.Type!=85">
                            <p>器械清单模板</p>
                            <el-select v-model="editBoxData.InstrumentListTemplate" placeholder="器械清单模板" class="green24x13">
                                <el-option label="A4" :value="0"></el-option>
                                <el-option label="A5" :value="1"></el-option>
                            </el-select>
                        </li>
                        <li v-if="editBoxData.Type!=85&&editBoxData.Type!=81">
                            <p>清单打印份数</p>
                            <el-input-number v-model="editBoxData.HowManyInstrumentListArePrinted" :min="0" :max="999" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'HowManyInstrumentListArePrinted')})"></el-input-number>
                        </li>
                        <li v-if="editBoxData.Type != 82">
                            <p>灭菌类型</p>
                            <el-select v-model="editBoxData.DeviceType" class="green24x13">
                                <el-option label="高温蒸汽" :value="2"></el-option>
                                <el-option label="低温等离子" :value="3"></el-option>
                                <el-option label="环氧乙烷" :value="4"></el-option>
                            </el-select>
                        </li>
                        <li v-if="editBoxData.Type!=85">
                            <p>成本价格</p>
                            <el-input-number placeholder="成本价格" v-model="editBoxData.CostPrice" :min="1" :max="999" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'CostPrice')})"></el-input-number>
                        </li>
                        <li v-if="editBoxData.Type!=85">
                            <p>清算价格</p>
                            <el-input-number placeholder="清算价格" v-model="editBoxData.ClearingPrice" :min="1" :max="999" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'ClearingPrice')})"></el-input-number>
                        </li>
                        <li class="textareaBox">
                            <p>备注</p>
                            <el-input type="textarea" placeholder="填写备注" v-model.trim="editBoxData.Remark" maxlength="20" show-word-limit></el-input>
                        </li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="包属性" name="1">
                    <ul class="clear_float ul_form_style">
                        <li v-if="editBoxData.Type==80||editBoxData.Type==82">
                            <p>通用包</p>
                            <el-select v-model="editBoxData.IsCommonProduct" class="green24x13" @change="commonPackageChange">
                                <el-option label="是" :value="true"></el-option>
                                <el-option label="否" :value="false"></el-option>
                            </el-select>
                        </li>
                        <li v-if="editBoxData.Type==80||editBoxData.Type==82||editBoxData.Type==83">
                            <p>发放生成方式</p>
                            <el-select v-model="editBoxData.ProvideGenerateType" class="green24x13" :disabled="editBoxData.IsDirectProvideToClinic">
                                <el-option v-if="editBoxData.Type==80||editBoxData.Type==82" label="回收生成发放" :value="0" :disabled="editBoxData.IsCommonProduct"></el-option>
                                <el-option label="预定生成发放" :value="1"></el-option>
                                <el-option v-if="editBoxData.Type==83" label="配包生成发放" :value="2"></el-option>
                                <el-option v-if="editBoxData.Type==80||editBoxData.Type==82||editBoxData.Type==83" label="手动生成任务" :value="3"></el-option>
                            </el-select>
                        </li>
                        <li v-if="editBoxData.Type==80">
                            <p>单网篮包</p>
                            <el-select v-model="editBoxData.IsSingleCarrierProduct" class="green24x13" @change="singleCarrierProductChange">
                                <el-option label="否" :value="false"></el-option>
                                <el-option label="是" :value="true"></el-option>
                            </el-select>
                        </li>
                    </ul>
                    <ul class="clear_float ul_form_style">
                        <li v-if="editBoxData.Type==80||editBoxData.Type==82" v-show="!editBoxData.IsSingleCarrierProduct">
                            <p>计数包</p>
                            <el-select v-model="editBoxData.IsNotPrintBarCode" @change="countPackageChange" class="green24x13">
                                <el-option label="是" :value="true"></el-option>
                                <el-option label="否" :value="false"></el-option>
                            </el-select>
                        </li>
                        <li v-if="editBoxData.Type==80||editBoxData.Type==82" v-show="editBoxData.IsNotPrintBarCode">
                            <p>打印标签</p>
                            <el-select v-model="editBoxData.IsPrintLabel" class="green24x13">
                                <el-option label="是" :value="true"></el-option>
                                <el-option label="否" :value="false"></el-option>
                            </el-select>
                        </li>
                    </ul>
                    <ul class="clear_float ul_form_style">
                        <li v-if="editBoxData.Type==80||editBoxData.Type==82" v-show="!editBoxData.IsSingleCarrierProduct">
                            <p>个数包</p>
                            <el-select v-model="editBoxData.IsNumberProduct" @change="numberPackageChange" class="green24x13">
                                <el-option label="是" :value="true"></el-option>
                                <el-option label="否" :value="false"></el-option>
                            </el-select>
                        </li>
                        <li v-if="editBoxData.Type==80||editBoxData.Type==82" v-show="editBoxData.IsNumberProduct">
                            <p>单包总个数</p>
                            <el-input-number v-model="editBoxData.NumberProductQuantity" :min="0" :max="999" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'NumberProductQuantity')})"></el-input-number>
                        </li>
                    </ul>
                    <ul class="clear_float ul_form_style">
                        <li v-if="editBoxData.Type==81">
                            <p>关联供应商</p>
                            <el-select filterable v-model="editBoxData.SupplierId" class="green24x13" placeholder="请选择(必选)">
                                <el-option v-for="(item,index) in suppliers" :key="index" :label="item.Name" :value="item.SupplierId"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <p>直接发放</p>
                            <el-select v-model="editBoxData.IsDirectProvideToClinic" class="green24x13" @change="directProvideToClinicChange">
                                <el-option label="否" :value="false"></el-option>
                                <el-option label="是" :value="true"></el-option>
                            </el-select>
                        </li>
                    </ul>
                </el-tab-pane>
            </el-tabs>
            <div class="photoOption" v-if="editBoxData.Type!=85">
                <span>已拍照片</span>
                <p>
                    <s>{{computedPhotoNumber}}</s>
                    <a @click="handleShowPhotos">拍照</a>
                </p>
            </div>
            <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
                <!-- 拍照 -->
                <PhotoView v-if="isShowPhoto" @viewPhoto-to-father="viewPhotoToFather" :data="editBoxData.ProductPictures" :DeletedPicturesId="editBoxData.DeletedPicturesId  "></PhotoView>
            </transition>
            <el-tabs v-model="tabActiveName" v-show="editBoxData.Type==81||editBoxData.IsNumberProduct?false:true" v-if="editBoxData.Type!=85">
                <el-tab-pane label="器械" name="first" v-if="editBoxData.Type==83?false:true">
                    <div class="packageDetail">
                        <el-table :data="editBoxData.InstrumentCounts" :row-key="getRowKeys" min-width="300">
                            <el-table-column prop="Name" label="名称" width="240"></el-table-column>
                            <el-table-column prop="Specification" label="规格" width="210"></el-table-column>
                            <el-table-column label="数量" width="210">
                                <template slot-scope="props">
                                    <el-input-number v-model="props.row.Quantity" :min="1" :max="999" :controls="false" size="mini" @change="((newValue)=>{talbeNumberChange(newValue,'InstrumentCounts',props.$index)})"></el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="210">
                                <template slot-scope="props">
                                    <a @click="deleteInstrument(props.$index)">删除</a>
                                </template>
                            </el-table-column>
                            <el-table-column></el-table-column>
                        </el-table>
                        <h5>
                            <el-button type="primary" @click="addInstrument" class="btn88x32">新增</el-button>
                        </h5>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="包原料" name="second">
                    <div class="packageDetail">
                        <el-table :data="editBoxData.MaterialCounts" :row-key="getRowKeys">
                            <el-table-column prop="Name" label="名称" width="240"></el-table-column>
                            <el-table-column prop="Specification" label="规格" width="210"></el-table-column>
                            <el-table-column label="数量" width="210">
                                <template slot-scope="props">
                                    <el-input-number v-model="props.row.Quantity" :min="1" :max="999" :controls="false" size="mini" @change="((newValue)=>{talbeNumberChange(newValue,'MaterialCounts',props.$index)})"></el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="210">
                                <template slot-scope="props">
                                    <a @click="deleteMaterial(props.$index)">删除</a>
                                </template>
                            </el-table-column>
                            <el-table-column></el-table-column>
                        </el-table>
                        <h5>
                            <el-button type="primary" @click="addMaterial" class="btn88x32">新增</el-button>
                        </h5>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 器械列表 -->
        <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
            <InstrumentList v-if="showInstrumentList" @to-father="child2father"></InstrumentList>
        </transition>
        <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
            <MaterialList v-if="showMaterialList" @to-father="child2father2"></MaterialList>
        </transition>
        <div class="editBoxOption">
            <el-button @click="editBoxCancelSave">取消</el-button>
            <el-button type="primary" @click="editBoxSave">完成</el-button>
        </div>
    </div>
</div>
</template>

<script>
import Sortable from "sortablejs";
import PhotoView from "../common/PhotoView";
import InstrumentList from "../common/InstrumentList";
import MaterialList from "../common/MaterialList";
export default {
    props: ["data"],
    data() {
        return {
            editBoxData: {
                ProductPictures: []
            },
            isShowPhoto: false,
            showInstrumentList: false, //显示器械列表
            showMaterialList: false, //显示辅料列表
            optionCssdList: [], //css列表
            optionClinicList: [], //科室列表
            optionExternalPackageList: [], //外包装列表
            tabActiveName: "first",
            selectedOptions: [],
            suppliers: []
        };
    },
    components: {
        InstrumentList,
        MaterialList,
        PhotoView
    },
    created() {
        //个数包 没有器械
        this.editBoxData = this.$props.data;
        this.editBoxData.DeletedPicturesId =
            this.editBoxData.DeletedPicturesId == null ? [] :
            this.editBoxData.DeletedPicturesId;
        if (this.editBoxData.Type == 83) {
            this.tabActiveName = "second";
            if (this.editBoxData.Id == 0) {
                this.editBoxData.ProvideGenerateType = 2;
            }
        }
        axios({
                url: `/api/Product/EditProductData/${this.editBoxData.Id}`
            })
            .then(res => {
                if (res.data.Code == 200) {
                    this.optionCssdList = res.data.Data.ExternalPackageCssdClinic.Cssds;
                    this.optionClinicList =
                        res.data.Data.ExternalPackageCssdClinic.Clinics;
                    this.optionExternalPackageList =
                        res.data.Data.ExternalPackageCssdClinic.ExternalPackageSelectors;
                    this.editBoxData.InstrumentCounts = res.data.Data.Instruments;
                    this.editBoxData.MaterialCounts = res.data.Data.Materials;
                    this.editBoxData.ProductPictures = res.data.Data.Pictures;
                    if (this.editBoxData.Id != 0) {
                        // 恢复发放科室的ui
                        let onOff = false;
                        for (let i = 0; i < this.optionClinicList.length; i++) {
                            for (
                                let j = 0; j < this.optionClinicList[i].children.length; j++
                            ) {
                                if (
                                    this.editBoxData.ProvideSubClinicId ==
                                    this.optionClinicList[i].children[j].value
                                ) {
                                    onOff = true;
                                    this.editBoxData.ProvideClinicId = this.optionClinicList[
                                        i
                                    ].value;
                                    break;
                                }
                            }
                            if (onOff) {
                                break;
                            }
                        }
                        this.selectedOptions.splice(0, 1, this.editBoxData.ProvideClinicId); //级联选择器 恢复ui
                        this.selectedOptions.splice(
                            1,
                            1,
                            this.editBoxData.ProvideSubClinicId
                        ); //级联选择器 恢复ui
                    }

                    if (this.editBoxData.Type == 81) {
                        //外来器械关联生产商
                        axios({
                                url: "/api/Supplier/ByType/1"
                            })
                            .then(res => {
                                if (res.data.Code == 200) {
                                    this.suppliers = res.data.Data;
                                } else {
                                    this.showInformation({
                                        classify: "message",
                                        msg: res.data.Msg
                                    });
                                }
                            })
                            .catch(err => {});
                    }
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            })
            .catch(err => {});
    },
    mounted() {
        if (this.editBoxData.Type != 85) {
            this.rowDrop();
        }
    },
    methods: {
        viewPhotoToFather() {
            this.isShowPhoto = false;
        },
        //处理显示图片
        handleShowPhotos() {
            this.isShowPhoto = true;
        },
        //器械or原料 el-input-number change事件
        talbeNumberChange(newValue, origin, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.editBoxData[origin][index].Quantity = 1;
                }, 0);
            }
        },
        //el-input-number change 事件
        numberChange(newValue, oldValue, origin) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.editBoxData[origin] = oldValue;
                }, 0);
            }
        },
        //直接发放change事件
        directProvideToClinicChange(val) {
            if (val) {
                this.editBoxData.ProvideGenerateType = 3;
            }
        },
        //通用包change事件
        commonPackageChange(val) {
            if (val) {
                this.editBoxData.ProvideGenerateType = 3;
            }
        },
        //个数包change事件
        numberPackageChange(val) {
            if (val == false) {
                this.editBoxData.NumberProductQuantity = 0;
            }
        },
        //计数包change事件
        countPackageChange(val) {
            if (val == false) {
                this.editBoxData.IsPrintLabel = false;
            }
        },
        //单网篮包change事件
        singleCarrierProductChange(val) {
            if (val) {
                this.editBoxData.IsNotPrintBarCode = false;
                this.editBoxData.IsPrintLabel = false;
                this.editBoxData.IsNumberProduct = false;
                this.editBoxData.NumberProductQuantity = 0;
            }
        },
        getRowKeys(row) {
            return row.Id;
        },
        //取消编辑
        editBoxCancelSave() {
            this.$emit("to-father", "");
        },
        //保存编辑
        editBoxSave() {
            //before submit must to do： 数据转换 表单验证;
            let axiosMethod = "";
            let arr = [{
                    val: this.editBoxData.Name,
                    type: "StringNotEmpty",
                    msg: "包名称不能为空！"
                },
                {
                    val: this.editBoxData.ExternalPackage,
                    type: "StringNotEmpty",
                    msg: "外包装不能为空！"
                },
                {
                    val: this.editBoxData.ProvideSubClinicId,
                    type: "StringNotEmpty",
                    msg: "发放科室不能为空！"
                },
                {
                    val: this.editBoxData.ProvideCssdId,
                    type: "StringNotEmpty",
                    msg: "发放供应室不能为空！"
                }
            ];
            if (this.editBoxData.Id == 0) {
                //新增模式
                axiosMethod = "post";
            } else {
                //更新模式
                axiosMethod = "put";
                arr.push({
                    val: this.editBoxData.ShortCode,
                    type: "ValueNotEmptyAndNotNull",
                    msg: "简码不能为空！"
                });
            }
            if (this.editBoxData.IsNumberProduct) {
                //个数包没有器械 editBoxData.SupplierId
                this.editBoxData.InstrumentCounts = [];
            }
            // 外来器械包
            if (this.editBoxData.Type === 81) {
                arr.push({
                    val: this.editBoxData.SupplierId,
                    type: "StringNotEmpty",
                    msg: "外来器械包还没有关联供应商！"
                });
            } else {
                //非外来器械包
                this.editBoxData.SupplierId = 0;
            }
            if (this.GLOBAL.VerificationHandle(arr)) {
                axios({
                        url: "/api/Product",
                        method: axiosMethod,
                        data: this.editBoxData
                    })
                    .then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            //请求成功
                            type = "success";
                            this.$emit("to-father", res.data.Data);
                        } else {
                            //其他状态码
                            type = "error";
                        }
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg,
                            type: type
                        });
                    })
                    .catch(error => {});
            }
        },
        //新增器械
        addInstrument() {
            this.showInstrumentList = true;
        },
        //删除器械
        deleteInstrument(index) {
            this.editBoxData.InstrumentCounts.splice(index, 1);
        },
        //新增包原料
        addMaterial() {
            this.showMaterialList = true;
        },
        //删除包原料
        deleteMaterial(index) {
            this.editBoxData.MaterialCounts.splice(index, 1);
        },
        handleChange() {
            this.editBoxData.ProvideClinicId = this.selectedOptions[0];
            this.editBoxData.ProvideSubClinicId = this.selectedOptions[1];
        },
        //器械列表给父组件传值
        child2father(data) {
            this.showInstrumentList = false;
            if (data.length > 0) {
                if (this.editBoxData.InstrumentCounts.length == 0) {
                    this.editBoxData.InstrumentCounts = data;
                } else {
                    for (var i = 0; i < data.length; i++) {
                        var onOff = false; //判断是否存在 true为存在 false不存在
                        for (var j = 0; j < this.editBoxData.InstrumentCounts.length; j++) {
                            if (data[i].Id == this.editBoxData.InstrumentCounts[j].Id) {
                                //已存在
                                onOff = true;
                                this.editBoxData.InstrumentCounts[j].Quantity +=
                                    data[i].Quantity;
                            }
                        }
                        //不存在
                        if (!onOff) {
                            this.editBoxData.InstrumentCounts.push(data[i]);
                        }
                    }
                }
            }
        },
        //原料列表给父组件传值
        child2father2(data) {
            this.showMaterialList = false;
            if (data.length > 0) {
                if (this.editBoxData.MaterialCounts.length == 0) {
                    this.editBoxData.MaterialCounts = data;
                } else {
                    for (var i = 0; i < data.length; i++) {
                        var onOff = false; //判断是否存在 true为存在 false不存在
                        for (var j = 0; j < this.editBoxData.MaterialCounts.length; j++) {
                            if (data[i].Id == this.editBoxData.MaterialCounts[j].Id) {
                                //已存在
                                onOff = true;
                                this.editBoxData.MaterialCounts[j].Quantity += data[i].Quantity;
                            }
                        }
                        //不存在
                        if (!onOff) {
                            this.editBoxData.MaterialCounts.push(data[i]);
                        }
                    }
                }
            }
        },
        //行拖拽
        rowDrop() {
            if (this.editBoxData.Type != 83) {
                const tbody = document.querySelector(
                    ".EditBoxContentOfProduct #pane-first .el-table__body-wrapper tbody"
                );
                Sortable.create(tbody, {
                    animation: 180,
                    delay: 0,
                    onEnd: ({
                        newIndex,
                        oldIndex
                    }) => {
                        const currRow = this.editBoxData.InstrumentCounts.splice(
                            oldIndex,
                            1
                        )[0];
                        this.editBoxData.InstrumentCounts.splice(newIndex, 0, currRow);
                    }
                });
            }
            const tbody2 = document.querySelector(
                ".EditBoxContentOfProduct #pane-second .el-table__body-wrapper tbody"
            );
            Sortable.create(tbody2, {
                animation: 180,
                delay: 0,
                onEnd: ({
                    newIndex,
                    oldIndex
                }) => {
                    const currRow = this.editBoxData.MaterialCounts.splice(
                        oldIndex,
                        1
                    )[0];
                    this.editBoxData.MaterialCounts.splice(newIndex, 0, currRow);
                }
            });
        }
    },
    computed: {
        computedPhotoNumber() {
            return this.editBoxData.ProductPictures == null ?
                0 :
                this.editBoxData.ProductPictures.length;
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableUnExpand";

#editBox {
    .EditBoxContentOfProduct {
        .photoOption {
            display: flex;
            padding: 20px 0 0 30px;
            line-height: 40px;

            span {
                margin-right: 20px;
                font-size: 16px;
                font-family: Microsoft YaHei;
                color: rgba(135, 141, 159, 1);
            }

            p {
                s {
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    color: #333333;
                    font-weight: bold;
                }

                a {
                    margin: 0 10px;
                    font-size: 16px;
                    cursor: pointer;
                    font-family: Microsoft YaHei;
                    color: #00c16b;
                    font-weight: bold;
                }

                b {
                    font-family: Microsoft YaHei;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    color: #00c16b;
                }
            }
        }

        .el-tabs.productAttributes {
            padding: 20px 0 20px 30px;

            .el-tabs__content {
                height: 241px;
            }
        }

        .el-tabs--top {
            padding: 20px 30px;

            .el-tabs__header {
                height: 50px;
                margin: 0;

                .el-tabs__nav-wrap {
                    &::after {
                        height: 0;
                    }

                    .el-tabs__active-bar {
                        height: 0;
                    }

                    .el-tabs__item {
                        height: 32px;
                        font-size: 18px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: rgba(35, 46, 65, 1);
                        transition: 0.3s;

                        &.is-active {
                            font-size: 24px;
                            color: rgba(35, 46, 65, 1);
                        }
                    }
                }
            }

            .el-tabs__content {
                .el-table {
                    tbody {
                        tr:hover>td {
                            background: transparent;
                        }

                        .cell {
                            font-size: 18px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: rgba(35, 46, 65, 1);

                            a {
                                color: #f93e3e;
                                cursor: pointer;
                                font-weight: bold;
                            }
                        }
                    }
                }

                h5 {
                    margin-top: 20px;
                }
            }
        }
    }
}
</style>
