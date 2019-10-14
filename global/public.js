import $ from 'jquery'
$('body').on('click', '.basic_table_tb_tr_box', function() {
    $(this).parent().toggleClass('isActive');
})

$('body').on('click', '.cssd_table_expand .el-table__row', function(e) {
    // $(this).next().find('td').slideToggle('fast');
    $(this).next().stop().slideToggle('fast');
})