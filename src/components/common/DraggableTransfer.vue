<template>
  <div id="transferBox">
    <div class="box">
      <div class="title">
        <span :class="{active: leftSelect === data1.length}" @click="selectAll(data1)">未选报表参数</span>
        <span>{{leftSelect ? leftSelect : 0}}/{{data1.length}}</span>
      </div>

      <div @drop="dropPub($event, 2)" @dragover.prevent class="left">
        <div
          @drag="ondrag"
          @dragstart="dragstart($event, item)"
          @dragend="dragend"
          draggable="true"
          class="hover-color"
          :class="{active: item.IsSelect }"
          v-on:click="hanldleClick(data1, item.Id)"
          v-for="(item,index) in changeSourceData"
          :key="index"
        >{{item.DisplayName}}</div>
      </div>
    </div>

    <div class="middle">
      <div v-on:click="moveItem(data2,data1)" :class="{active: rightSelect > 0}">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div v-on:click="moveItem(data1, data2)" :class="{active: leftSelect > 0}">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <div class="box">
      <div class="title">
        <span :class="{active: rightSelect === data2.length}" @click="selectAll(data2)">已选报表参数</span>
        <span>{{rightSelect ? rightSelect : 0}}/{{data2.length}}</span>
      </div>

      <div @drop="dropPub($event, 1)" @dragover.prevent class="right">
        <div
          class="hover-color"
          @drag="ondrag"
          @dragstart="dragstart($event, item)"
          @dragend="dragend"
          draggable="true"
          :class="{active: item.IsSelect }"
          v-on:click="hanldleClick(data2, item.Id)"
          v-for="(item,index) in changeTargetData"
          :key="index"
        >{{item.DisplayName}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  props: {
    sourceLeft: {
      //左边来源数据
      type: Array
    },
    targetRight: {
      //目标选择数据
      type: Array
    }
    // changeSourceData:{
    //     type:Array
    // },
    // changeTargetData:{
    //     type:Array
    // },
  },
  data() {
    return {
      data1: [],
      data2: [],
      target: {
        x: "",
        y: "",
        Id: ""
      },
      // sourceData: '',
      // targetData: '',
      changeSourceData: [],
      changeTargetData: []
    };
  },
  created() {
    this.sourceLeft.forEach(item => {
      this.data1.push({
        Id: item.Id,
        DisplayName: item.DisplayName,
        IsSelect: false,
        SpliceName: item.SpliceName,
        Type: item.Type,
        UrlString: item.UrlString
      });
    });
    this.changeSourceData = this.data1;
    this.changeTargetData = this.data2;
  },
  mounted() {
    let empty = [];
    if (this.targetRight.length > 0) {
      this.targetRight.forEach(item => {
        empty.push({
          Id: item.Id,
          DisplayName: item.DisplayName,
          IsSelect: false,
          SpliceName: item.SpliceName,
          Type: item.Type,
          UrlString: item.UrlString
        });
      });
      this.data2 = empty;
      this.changeTargetData = empty;
    }
  },
  watch: {
    sourceLeft() {
      this.data1 = [];
      this.sourceLeft.forEach(item => {
        this.data1.push({
          Id: item.Id,
          SpliceName: item.SpliceName,
          DisplayName: item.DisplayName,
          IsSelect: false,
          Type: item.Type,
          UrlString: item.UrlString
        });
      });
      this.changeSourceData = this.data1;
      this.changeTargetData = this.data2;
    },
    value() {
      // 通过编辑按钮的接口拿到已经存在的课件id，然后遍历源数据，删除已经存在的课件
      if (this.value.length > 0) {
        this.value.forEach(item => {
          this.data1.forEach((v, i) => {
            if (item == v.Id) {
              this.data1.splice(i, 1);
            }
          });
        });
      }
    },
    targetRight() {
      let empty = [];
      if (this.targetRight.length > 0) {
        this.targetRight.forEach(item => {
          empty.push({
            Id: item.Id,
            DisplayName: item.DisplayName,
            IsSelect: false,
            SpliceName: item.SpliceName,
            Type: item.Type,
            UrlString: item.UrlString
          });
        });
        this.data2 = empty;
        this.changeTargetData = empty;
      }
    }
  },
  methods: {
    ondrag(event) {
      this.target.y = event.y;
      this.target.x = event.x;
    },
    dropPub(event, type) {
      if (type == 1) {
        this.drop(event, this.data1, this.data2, type);
      } else {
        this.drop(event, this.data2, this.data1, type);
      }
    },
    drop(event, handle, target, type) {
      // 被拖拽数据中的id值
      let Id = event.dataTransfer.getData("Id");
      handle.forEach((item, index) => {
        if (item.Id == Id) {
          let temp = handle.splice(index, 1);
          temp[0].IsSelect = false;
          target.push(temp[0]);
        }
      });
      this.resort(event, target, type);
    },
    resort(event, target, type) {
      let eles = event.currentTarget.children;
      // console.log(eles, target)
      let emptyArray = [];
      // type=1 从左往右拖拽 type=2 从右往左拖拽
      if (type == 1) {
        target.forEach(item => {
          emptyArray.push(item.Id);
        });
        // v-model 可以监听这个input事件的触发
        this.$emit("input", emptyArray);
      }
      if (type == 2) {
        let tempId = event.dataTransfer.getData("Id");
        this.changeTargetData.forEach(item => {
          if (item.Id != tempId) {
            emptyArray.push(item.Id);
          }
        });
        // v-model 可以监听这个input事件的触发
        this.$emit("input", emptyArray);
      }
      // 两个框拖拽数据
      for (let i = 0; i < target.length; i++) {
        if (target[i].Id == this.target.Id) {
          target[i].y = this.target.y;
        } else {
          // 获取元素在页面上位置，纵坐标
          target[i].y = eles[i].getBoundingClientRect().y;
        }
      }
      // 单个框中换位置
      for (let i = 0; i < target.length - 1; i++) {
        for (let j = 0; j < target.length - i - 1; j++) {
          if (target[j].y > target[j + 1].y) {
            let swap = target[j];
            target[j] = target[j + 1];
            target[j + 1] = swap;
          }
        }
      }
      // vue强制更新视图
      this.$forceUpdate();
    },
    dragstart(event, item) {
      this.target.Id = item.Id;
      event.dataTransfer.setData("Id", item.Id);
    },
    dragend(event) {
      event.dataTransfer.clearData();
      this.$emit("transfer-to-father", this.changeTargetData);
    },
    hanldleClick(data, Id) {
      data.forEach(element => {
        if (element.Id == Id) {
          element.IsSelect = !element.IsSelect;
        }
      });
    },
    moveItem(handle, target) {
      let temp = handle.filter(item => {
        return item.IsSelect == true;
      });
      if (temp.length <= 0) return false;
      temp.forEach(item => {
        let index = handle.indexOf(item);
        handle.splice(index, 1);
        item.IsSelect = false;
        target.push(item);
      });
      this.$emit("transfer-to-father", this.changeTargetData);
    },
    selectAll(data) {
      let IsSelectAll = data.every(item => {
        return item.IsSelect == true;
      });
      data.forEach(item => {
        if (IsSelectAll) {
          item.IsSelect = false;
        } else {
          item.IsSelect = true;
        }
      });
    }
  },
  computed: {
    leftSelect() {
      if (this.data1.length === 0) return false;
      let arr = this.data1.filter(item => {
        return item.IsSelect == true;
      });
      return arr.length;
    },
    rightSelect() {
      if (this.data2.length == 0) return false;
      let arr = this.data2.filter(item => {
        return item.IsSelect == true;
      });
      return arr.length;
    }
  }
};
</script>
<style lang="scss">
#transferBox {
  display: flex;
  align-items: center;
  padding: 20px 30px;
  .box {
    border: 1px solid rgb(235, 238, 245);
    width: 300px;
  }
  .box .title {
    font-size: 14px;
    box-sizing: border-box;
    display: flex;
    padding-right: 10px;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    background: #f7f8fa;
  }
  .box .title span:first-child {
    display: inline-block;
    background-image: url("/images/check-box-outline-blank.png");
    background-repeat: no-repeat;
    background-position: 10px center;
    background-size: 20px 20px;
    padding-left: 35px;
    cursor: pointer;
    font-size: 16px;
    font-family: Microsoft YaHei;
    color: rgba(135, 141, 159, 1);
  }
  .box .title span:last-child {
    font-size: 12px;
    font-family: Microsoft YaHei;
    color: rgba(135, 141, 159, 1);
  }
  .box .title span:first-child.active {
    background-image: url("/images/check_box.png");
  }
  .left,
  .right {
    height: 360px;
    padding: 5px 0;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .left > div,
  .right > div {
    cursor: pointer;
    text-align: left;
    background-image: url("/images/check-box-outline-blank.png");
    background-repeat: no-repeat;
    background-position: 10px center;
    background-size: 20px 20px;
    font-size: 14px;
    padding-left: 35px;
    line-height: 30px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    color: #232e41;
    font-weight: bold;
    height: 44px;
    line-height: 44px;
  }
  .left > div.active,
  .right > div.active {
    background-image: url("/images/check_box.png");
  }
  .left > div.hover-color:hover,
  .right > div.hover-color:hover,
  .left > div.hover-color.active,
  .right > div.hover-color.active {
    color: #00c16b;
  }
  .middle {
    margin: 0 20px;
  }
  .middle > div {
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 12px;
    background-color: #cccccc;
    .el-icon-arrow-left {
      width: 10px;
      height: 20px;
      background-image: url(../../assets/images/arrow_white_left.png);
      background-size: 10px 20px;
      &::before {
        content: "";
      }
    }
    .el-icon-arrow-right {
      width: 10px;
      height: 20px;
      background-image: url(../../assets/images/arrow_white_right.png);
      background-size: 10px 20px;
      &::before {
        content: "";
      }
    }
  }
  .middle > div.active {
    background-color: #00c16b;
    border-color: #00c16b;
    color: #ffffff;
  }
}
</style>
