<template>
  <div>
    <div id="jubu">
      <div style="width:98%;margin: 20px auto;">
        <h2 class="jilu" @click="payload">访客记录</h2>
        <h3 class="liudang">留档日期：{{currentdate}}</h3>
      </div>
      <div class="table-content">
        <table class="table table-bordered table-striped text-center">
          <thead>
            <tr class="tr_th">
              <th style="width:7%">来访日期</th>
              <th>访客姓名</th>
              <th>证件号码</th>
              <th style="width:10%">证件照片</th>
              <th style="width:10%">现场照片</th>
              <th style="width:12%">所属单位</th>
              <th style="width:12%">拜访单位</th>
              <th>来访事由</th>
              <th>进入时间</th>
              <th>离开时间</th>
              <th>值班人</th>
            </tr>
          </thead>
          <tbody>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
            <tr class="tr_td">
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
              <td>系统管理员</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        <button class="f-btn" @click="setpdf('jubu')" style="background-color: #67C23A;">下载</button>
        <button class="f-btn" @click="$router.back(-1)">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "hello",
  data() {
    return {
      currentdate: ""
    };
  },
  mounted() {
    this.getNowFormatDate();
  },
  computed: {},
  methods: {
    payload() {
      let localData = JSON.parse(window.sessionStorage.getItem("payload"));
      if (this.$store.state.exporttable.templateRadio.length <= 0) {
        this.$store.commit("exporttable/pushdata", localData); //同步操作
      }
      return this.$store.state.exporttable.templateRadio;
    },
    //获取当前时间
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        date.getFullYear() + seperator1 + month + seperator1 + strDate;
      this.currentdate = currentdate;
    },
    //
    setpdf() {
      //打印pdf文件
      var jubuData = document.getElementById("jubu").innerHTML;
      window.document.body.innerHTML = jubuData;
      //兼容IE
      if (getExplorer() == "IE") {
        pagesetup_null();
      }
      window.print();

      function pagesetup_null() {
        var hkey_root, hkey_path, hkey_key;
        hkey_root = "HKEY_CURRENT_USER";
        hkey_path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        try {
          var RegWsh = new ActiveXObject("WScript.Shell");
          hkey_key = "header";
          RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "");
          hkey_key = "footer";
          RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "");
        } catch (e) {}
      }

      function getExplorer() {
        var explorer = window.navigator.userAgent; //ie
        if (explorer.indexOf("MSIE") >= 0) {
          return "IE";
        } //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
          return "Firefox";
        } //Chrome
        else if (explorer.indexOf("Chrome") >= 0) {
          return "Chrome";
        } //Opera
        else if (explorer.indexOf("Opera") >= 0) {
          return "Opera";
        } //Safari
        else if (explorer.indexOf("Safari") >= 0) {
          return "Safari";
        }
      }
      function print(id_str) {
        var el = document.getElementById(id_str);
        var iframe = document.createElement("IFRAME");
        var doc = null;
        document.body.appendChild(iframe);
        doc = iframe.contentWindow.document;
        doc.write("<div>" + el.innerHTML + "</div>");
        doc.close();
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        if (navigator.userAgent.indexOf("MSIE") > 0) {
          document.body.removeChild(iframe);
        }
      }
      this.$router.go(0);
    }
  }
};
</script>
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
tr,
th {
  text-align: center;
}

.table-content {
  margin: 10px 20px 45px 20px;
  min-width: 1360px;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
table,
th,
td {
  border: 1px solid #e7e7e7;
  padding: 5px 0;
}
.tr_th th {
  background: rgb(202, 217, 239);
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 5px;
}
.grid-content {
  padding-left: 1%;
}
.bg-purple {
  margin: 10px 0;
}
.grid-content .check-ipt {
  width: 72%;
  margin-left: -4px;
}
.check-size {
  height: 38px;
  display: block;
  text-align: center;
  line-height: 38px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  border-right: 0 none;
  background: #dcdfe6;
  font-size: 14px;
  color: #5b5b5b;
  border-radius: 5px 0 0 5px;
  width: 20%;
  font-weight: 900;
}
.check-ipt,
.check-size {
  float: left;
}
.wh-box {
  width: -moz-calc(90% + 20px);
  width: -webkit-calc(90% + 20px);
  width: calc(90% + 20px);
}
.fr {
  float: right;
}
.padd {
  margin: 0 15px;
}
/* 右浮动按钮 */
.footer {
  position: fixed;
  text-align: center;
  bottom: 35px;
  right: 20px;
  width: 60px;
  z-index: 9999;
}
.size {
  font-size: 25px;
}
.f-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #409eff;
  border: 0 none;
  outline: none;
  cursor: pointer;
  color: #fff;
  margin-top: 10px;
}
.jilu {
  text-align: center;
  width: 100%;
  line-height: 70px;
  font-size: 35px;
  margin-right: 20px;
  /* margin-top:60px */
}
.liudang {
  text-align: right;
  /* margin-right:20px */
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: 2px solid #ddd;
}
.el-table--border,
.el-table--group {
  border-left: 1px solid #ebeef5;
  border-bottom: 1px solid #ddd;
}
@page {
  size: auto; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>