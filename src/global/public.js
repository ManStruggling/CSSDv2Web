import $ from 'jquery'

$('body').on('click', '.cssd_table_expand .el-table__row', function(e) {
    $(this).next().find('.table_detail').slideToggle('fast');
})