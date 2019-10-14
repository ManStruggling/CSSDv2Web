import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'index',
            component: () =>
                import ('./components/index/Index')
        },
        {
            path: '/configure',
            name: 'configure',
            component: () =>
                import ('./components/configure/Basic'),
            children: [{
                path: '/configure/system',
                name: 'SystemConfigure',
                component: () =>
                    import ('./components/configure/SystemConfigure')
            }, {
                path: '/configure/console',
                name: 'configureConsole',
                component: () =>
                    import ('./components/configure/Console')
            }]
        },
        {
            path: '/basic',
            name: 'basic',
            component: () =>
                import ('./components/basic/Basic'),
            children: [{
                    path: '/basic/device/:Type',
                    name: 'device',
                    component: () =>
                        import ('./components/basic/Device'),
                }, {
                    path: '/basic/instrument',
                    name: 'instrument',
                    component: () =>
                        import ('./components/basic/Instrument')
                }, {
                    path: '/basic/producer/:Type',
                    name: 'producer',
                    component: () =>
                        import ('./components/basic/Producer')
                }, {
                    path: '/basic/product/:Type',
                    name: 'product',
                    component: () =>
                        import ('./components/basic/Product')
                }, {
                    path: '/basic/supplier/:Type',
                    name: 'supplier',
                    component: () =>
                        import ('./components/basic/Supplier')
                }, {
                    path: '/basic/material',
                    name: 'material',
                    component: () =>
                        import ('./components/basic/Material')
                },
                {
                    path: '/basic/carrier/:Type',
                    name: 'carrier',
                    component: () =>
                        import ('./components/basic/Carrier')
                },
                {
                    path: '/basic/car/:Type',
                    name: 'car',
                    component: () =>
                        import ('./components/basic/Car')
                },
                {
                    path: '/basic/externalPackage',
                    name: 'externalPackage',
                    component: () =>
                        import ('./components/basic/ExternalPackage')
                },
                {
                    path: '/basic/clinic',
                    name: 'clinic',
                    component: () =>
                        import ('./components/basic/Clinic')
                },
                {
                    path: '/basic/staff',
                    name: 'staff',
                    component: () =>
                        import ('./components/basic/Staff')
                },
                {
                    path: '/basic/logisticsStaff',
                    name: 'logisticsStaff',
                    component: () =>
                        import ('./components/basic/LogisticsStaff')
                }, {
                    path: '/basic/disposable',
                    name: 'disposable',
                    component: () =>
                        import ('./components/basic/Disposable')
                }, {
                    path: '/basic/failedCause',
                    name: 'failedCause',
                    component: () =>
                        import ('./components/basic/FailedCause')
                }
            ]
        },
        {
            path: '/recovery',
            name: 'recovery',
            component: () =>
                import ('./components/recovery/Basic'),
            children: [{
                path: '/recovery/registration',
                name: 'registration',
                component: () =>
                    import ('./components/recovery/Registration')
            }, {
                path: '/recovery/record',
                name: 'record',
                component: () =>
                    import ('./components/recovery/Record')
            }, {
                path: '/recovery/newPurchasing',
                name: 'recoveryNewPurchasing',
                component: () =>
                    import ('./components/recovery/NewPurchasingRegistration')
            }]
        },
        {
            path: '/outerPackage',
            name: 'outerPackage',
            component: () =>
                import ('./components/outerPackage/Basic'),
            children: [{
                path: '/outerPackage/Registration',
                name: 'outerPackageRegistration',
                component: () =>
                    import ('./components/outerPackage/Registration')
            }, {
                path: '/outerPackage/record',
                name: 'outerPackageRecord',
                component: () =>
                    import ('./components/outerPackage/Record')
            }]
        },
        {
            path: '/clean',
            name: 'clean',
            component: () =>
                import ('./components/clean/Basic'),
            children: [{
                path: '/clean/select',
                name: 'cleanSelect',
                component: () =>
                    import ('./components/clean/CleanSelect')
            }, {
                path: '/clean/registration',
                name: 'cleanRegistration',
                component: () =>
                    import ('./components/clean/Registration')
            }, {
                path: '/clean/record',
                name: 'cleanRecord',
                component: () =>
                    import ('./components/clean/Record')
            }]

        },
        {
            path: '/package',
            name: 'package',
            component: () =>
                import ('./components/package/Basic'),
            children: [{
                    path: '/package/cleanCheck',
                    name: 'cleanCheck',
                    component: () =>
                        import ('./components/package/CleanCheck')
                },
                {
                    path: '/package/cleanCheckRecord',
                    name: 'cleanCheckRecord',
                    component: () =>
                        import ('./components/package/CleanCheckRecord')
                },
                {
                    path: '/package/cleanCheckRecordChange',
                    name: 'cleanCheckRecordChange',
                    component: () =>
                        import ('./components/package/CleanCheckRecordChange')
                },
                {
                    path: '/package/taskList',
                    name: 'taskList',
                    component: () =>
                        import ('./components/package/TaskList')
                },
                {
                    path: '/package/taskRecord',
                    name: 'taskRecord',
                    component: () =>
                        import ('./components/package/TaskRecord')
                }
            ]
        },
        {
            path: '/sterilize',
            name: 'sterilize',
            component: () =>
                import ('./components/sterilize/Basic'),
            children: [{
                path: '/sterilize/select',
                name: 'sterilizeSelect',
                component: () =>
                    import ('./components/sterilize/Select')
            }, {
                path: '/sterilize/ready',
                name: 'sterilizeReady',
                component: () =>
                    import ('./components/sterilize/Ready')
            }, {
                path: '/sterilize/readyRecord',
                name: 'sterilizeReadyRecord',
                component: () =>
                    import ('./components/sterilize/ReadyRecord')
            }, {
                path: '/sterilize/registration',
                name: 'sterilizeRegistration',
                component: () =>
                    import ('./components/sterilize/Registration')
            }, {
                path: '/sterilize/record',
                name: 'sterilizeRecord',
                component: () =>
                    import ('./components/sterilize/Record')
            }, {
                path: '/sterilize/check',
                name: 'sterilizeCheck',
                component: () =>
                    import ('./components/sterilize/Check')
            }, {
                path: '/sterilize/checkRecord',
                name: 'checkRecord',
                component: () =>
                    import ('./components/sterilize/CheckRecord')
            }, {
                path: '/sterilize/checkChange',
                name: 'checkChange',
                component: () =>
                    import ('./components/sterilize/CheckChange')
            }, {
                path: '/sterilize/recall',
                name: 'recall',
                component: () =>
                    import ('./components/sterilize/Recall')
            }, {
                path: '/sterilize/recallRecord',
                name: 'sterilizeRecallRecord',
                component: () =>
                    import ('./components/sterilize/RecallRecord')
            }]
        },
        {
            path: '/inventory',
            name: 'inventory',
            component: () =>
                import ('./components/inventory/Basic'),
            children: [{
                    path: '/inventory/hasBarCode',
                    name: 'inventoryHasBarCode',
                    component: () =>
                        import ('./components/inventory/HasBarCode')
                },
                {
                    path: '/inventory/notBarCode',
                    name: 'inventoryNotBarCode',
                    component: () =>
                        import ('./components/inventory/NotBarCode')
                }
            ]

        },
        {
            path: '/inventoryCounting',
            name: 'inventoryCounting',
            component: () =>
                import ('./components/inventoryCounting/Basic'),
            children: [{
                path: '/inventoryCounting/registration',
                name: 'inventoryCountingRegistration',
                component: () =>
                    import ('./components/inventoryCounting/Registration')
            }]

        },
        {
            path: '/track',
            name: 'track',
            component: () =>
                import ('./components/track/Basic'),
            children: [{
                path: '/track/patient',
                name: 'trackPatient',
                component: () =>
                    import ('./components/track/PatientTrack')
            }, {
                path: '/track/opration',
                name: 'trackOpration',
                component: () =>
                    import ('./components/track/OprationalLog')
            }, {
                path: '/track/package',
                name: 'trackPackage',
                component: () =>
                    import ('./components/track/PackageTrack')
            }, {
                path: '/track/singleRecall',
                name: 'trackSingleRecall',
                component: () =>
                    import ('./components/track/SingleRecall')
            }]
        },
        {
            path: '/provide',
            name: 'provide',
            component: () =>
                import ('./components/provide/Basic'),
            children: [{
                path: '/provide/registration',
                name: 'provideRegistration',
                component: () =>
                    import ('./components/provide/Registration')
            }, {
                path: '/provide/record',
                name: 'provideRecord',
                component: () =>
                    import ('./components/provide/Record')
            }, {
                path: '/provide/recordChange',
                name: 'provideRecordChange',
                component: () =>
                    import ('./components/provide/RecordChange')
            }, {
                path: '/provide/borrowRegistration',
                name: 'borrowRegistration',
                component: () =>
                    import ('./components/provide/BorrowRegistration')
            }, {
                path: '/provide/borrowRecord',
                name: 'borrowRecord',
                component: () =>
                    import ('./components/provide/BorrowRecord')
            }, {
                path: '/provide/reserveCheck',
                name: 'provideReserveCheck',
                component: () =>
                    import ('./components/provide/ReserveCheck')
            }, {
                path: '/provide/reserveCheckRecord',
                name: 'provideReserveCheckRecord',
                component: () =>
                    import ('./components/provide/ReserveCheckRecord')
            }, {
                path: '/provice/reserveChange',
                name: 'provideReserveChange',
                component: () =>
                    import ('./components/provide/ReserveChange')
            }]
        },
        {
            path: '/logistics',
            name: 'logistics',
            component: () =>
                import ('./components/logistics/Basic'),
            children: [{
                path: '/logistics/subClinicUsedPackage',
                name: 'logisticsSubClinicUsedPackage',
                component: () =>
                    import ('./components/logistics/SubClinicUsedPackage')
            }, {
                path: '/logistics/driverSchedule',
                name: 'logisticsDriverSchedule',
                component: () =>
                    import ('./components/logistics/DriverSchedule')
            }, {
                path: '/logistics/driverScheduleRecord',
                name: 'logisticsDriverScheduleRecord',
                component: () =>
                    import ('./components/logistics/Record')
            }, {
                path: '/logistics/look',
                name: 'logisticsLook',
                component: () =>
                    import ('./components/logistics/ScheduleSearch')
            }]
        },
        {
            path: '/apply',
            name: 'apply',
            component: () =>
                import ('./components/apply/Basic'),
            children: [{
                path: '/apply/registration',
                name: 'applyRegistration',
                component: () =>
                    import ('./components/apply/Registration')
            }, {
                path: '/apply/record',
                name: 'applyRecord',
                component: () =>
                    import ('./components/apply/Record')
            }, {
                path: '/apply/unqualifiedPackageRegistration',
                name: 'UnqualifiedPackageRegistration',
                component: () =>
                    import ('./components/apply/UnqualifiedPackageRegistration')
            }, {
                path: '/apply/unqualifiedRecord',
                name: 'unqualifiedRecord',
                component: () =>
                    import ('./components/apply/UnqualifiedRecord')
            }, {
                path: '/apply/putInInventory',
                name: 'applyPutInInventory',
                component: () =>
                    import ('./components/apply/PutInInventory')
            }, {
                path: '/apply/putInInventoryRecord',
                name: 'applyPutInInventoryRecord',
                component: () =>
                    import ('./components/apply/PutInInventoryRecord')
            }, {
                path: '/apply/reserve',
                name: 'applyReserve',
                component: () =>
                    import ('./components/apply/ReserveProduct')
            }, {
                path: '/apply/reserveRecord',
                name: 'applyReserveRecord',
                component: () =>
                    import ('./components/apply/ReserveProductRecord')
            }]
        },
        {
            path: '/login',
            name: 'login',
            component: () =>
                import ('./components/login/Login')
        },
        {
            path: '/test',
            name: 'test',
            component: () =>
                import ('./components/temp/test')
        },
        {
            path: '/management',
            name: 'management',
            component: () =>
                import ('./components/management/ControlPlat'),
            children: [{
                    path: '/management/control',
                    name: 'managementControl',
                    component: () =>
                        import ('./components/management/Desktop')
                },
                {
                    path: '/management/reportForm',
                    name: 'managementReportForm',
                    component: () =>
                        import ('./components/management/ReportForm')
                },
                {
                    path: '/management/viewReportForm',
                    name: 'managementViewReportForm',
                    component: () =>
                        import ('./components/management/ViewReportForm')
                }
            ]
        }
    ]
});

export default router;