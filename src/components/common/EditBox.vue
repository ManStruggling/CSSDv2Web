<template>
  <div id="editBox">
    <div class="editContainer">
      <ul class="clear_float">
        <li>
          <p>设备名称:</p>
          <input type="text" placeholder="设备名称">
        </li>
        <li>
          <p>设备编号:</p>
          <input type="text" placeholder="设备编号">
        </li>
        <li>
          <p>生产商:</p>
          <input type="text" placeholder="生产商">
        </li>
        <li>
          <p>总锅次:</p>
          <input type="text" placeholder="总锅次">
        </li>
        <li>
          <p>TodayBatch:</p>
          <input type="text" placeholder="当日锅次">
        </li>
      </ul>
      <dl>
        <dt>
          <p>程序名称</p>
          <p>程序运作时长</p>
          <p>操作</p>
        </dt>
        <dd>
          <p><input type="text"></p>
          <p><input type="text"></p>
          <p>
            <a class="deleteThisProg">删除</a>
          </p>
        </dd>
      </dl>
      <div class="addThisProg">
        <button>新增程序</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
#editBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.2);
  z-index: 2;
  .editContainer {
    width: 1300px;
    height: 600px;
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
    ul {
      li {
        float: left;
        width: 300px;
        display: flex;
        margin: 20px 50px;
      }
    }
    dl {
      dt {
        display: flex;
        justify-content: center;
        text-align: center;
        p {
          width: 300px;
        }
      }
      dd {
        display: flex;
        justify-content: center;
        text-align: center;
        margin:20px 0;
        input {
          width: 150px;
        }
        p{
          width: 300px;
        }
      }
    }
    .addThisProg{
      text-align:center;
      button{
        background: #99f;
        color: rgb(51, 24, 24);
        line-height: 30px;
        cursor:pointer;
        border-radius: 5px;
        font-size: 18px;
      }
    }
  }
}
input {
  border: 1px solid #999;
}
</style>