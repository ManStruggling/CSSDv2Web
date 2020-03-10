import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'index',
            meta: {
                index: 0
            },
            component: () =>
                import ('./components/index/Index')
        },
        {
            path: '/dataSource',
            name: 'dataSource',
            meta: { index: 1 },
            component: () =>
                import ('./components/dataSource/Basic'),
            children: [{
                    path: '/dataSource/device/:Type',
                    name: 'device',
                    component: () =>
                        import ('./components/dataSource/Device'),
                }, {
                    path: '/dataSource/instrument',
                    name: 'instrument',
                    component: () =>
                        import ('./components/dataSource/Instrument')
                }, {
                    path: '/dataSource/producer/:Type',
                    name: 'producer',
                    component: () =>
                        import ('./components/dataSource/Producer')
                }, {
                    path: '/dataSource/product/:Type',
                    name: 'product',
                    component: () =>
                        import ('./components/dataSource/Product')
                }, {
                    path: '/dataSource/supplier/:Type',
                    name: 'supplier',
                    component: () =>
                        import ('./components/dataSource/Supplier')
                }, {
                    path: '/dataSource/material',
                    name: 'material',
                    component: () =>
                        import ('./components/dataSource/Material')
                },
                {
                    path: '/dataSource/carrier/:Type',
                    name: 'carrier',
                    component: () =>
                        import ('./components/dataSource/Carrier')
                },
                {
                    path: '/dataSource/car/:Type',
                    name: 'car',
                    component: () =>
                        import ('./components/dataSource/Car')
                },
                {
                    path: '/dataSource/period/:Type',
                    name: 'period',
                    component: () =>
                        import ('./components/dataSource/Period')
                },
                {
                    path: '/dataSource/externalPackage',
                    name: 'externalPackage',
                    component: () =>
                        import ('./components/dataSource/ExternalPackage')
                },
                {
                    path: '/dataSource/clinic',
                    name: 'clinic',
                    component: () =>
                        import ('./components/dataSource/Clinic')
                },
                {
                    path: '/dataSource/staff',
                    name: 'staff',
                    component: () =>
                        import ('./components/dataSource/Staff')
                },
                {
                    path: '/dataSource/logisticsStaff',
                    name: 'logisticsStaff',
                    component: () =>
                        import ('./components/dataSource/LogisticsStaff')
                }, {
                    path: '/dataSource/disposable',
                    name: 'disposable',
                    component: () =>
                        import ('./components/dataSource/Disposable')
                }, {
                    path: '/dataSource/failedCause',
                    name: 'failedCause',
                    component: () =>
                        import ('./components/dataSource/FailedCause')
                }, {
                    path: '/dataSource/workArea',
                    name: 'workArea',
                    component: () =>
                        import ('./components/dataSource/WorkArea')
                }, {
                    path: '/dataSource/consumableProduct',
                    name: '/dataSource/consumableProduct',
                    component: () =>
                        import ('./components/dataSource/ConsumableProduct')
                },
                {
                    path: '/dataSource/receiveDepartment',
                    name: 'receiveDepartment',
                    component: () =>
                        import ('./components/dataSource/ReceiveDepartment')
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
                name: 'recoveryRegistration',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/recovery/Registration')
            }, {
                path: '/recovery/record',
                name: 'recoveryRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/recovery/Record')
            }, {
                path: '/recovery/newPurchasing',
                name: 'recoveryNewPurchasing',
                meta: {
                    index: 1
                },
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
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/outerPackage/Registration')
            }, {
                path: '/outerPackage/record',
                name: 'outerPackageRecord',
                meta: {
                    index: 2
                },
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
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/clean/CleanSelect')
            }, {
                path: '/clean/registration',
                name: 'cleanRegistration',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/clean/Registration')
            }, {
                path: '/clean/record',
                name: 'cleanRecord',
                meta: {
                    index: 2
                },
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
                    meta: {
                        index: 2
                    },
                    component: () =>
                        import ('./components/package/CleanCheck')
                },
                {
                    path: '/package/cleanCheckRecord',
                    name: 'cleanCheckRecord',
                    meta: {
                        index: 3
                    },
                    component: () =>
                        import ('./components/package/CleanCheckRecord')
                },
                {
                    path: '/package/taskList',
                    name: 'packageTaskList',
                    meta: {
                        index: 1
                    },
                    component: () =>
                        import ('./components/package/TaskList')
                },
                {
                    path: '/package/taskRecord',
                    name: 'packageTaskRecord',
                    meta: {
                        index: 2
                    },
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
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/sterilize/Select')
            }, {
                path: '/sterilize/ready',
                name: 'sterilizeReady',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/sterilize/Ready')
            }, {
                path: '/sterilize/substitutionPackage',
                name: 'sterilizeSubstitutionPackage',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/sterilize/SubstitutionPackagePrint')
            }, {
                path: '/sterilize/readyRecord',
                name: 'sterilizeReadyRecord',
                meta: {
                    index: 3
                },
                component: () =>
                    import ('./components/sterilize/ReadyRecord')
            }, {
                path: '/sterilize/registration',
                name: 'sterilizeRegistration',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/sterilize/Registration')
            }, {
                path: '/sterilize/record',
                name: 'sterilizeRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/sterilize/Record')
            }, {
                path: '/sterilize/check',
                name: 'sterilizeCheck',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/sterilize/Check')
            }, {
                path: '/sterilize/missingPackageAdd',
                name: 'sterilizeMissingPackageAdd',
                meta: {
                    index: 3,
                },
                component: () =>
                    import ('./components/sterilize/MissingPackageAdd')
            }, {
                path: '/sterilize/checkRecord',
                name: 'sterilizeCheckRecord',
                meta: {
                    index: 3
                },
                component: () =>
                    import ('./components/sterilize/CheckRecord')
            }, {
                path: '/sterilize/recall',
                name: 'recall',
                meta: {
                    index: 3
                },
                component: () =>
                    import ('./components/sterilize/Recall')
            }, {
                path: '/sterilize/recallRecord',
                name: 'sterilizeRecallRecord',
                meta: {
                    index: 3
                },
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
                    meta: {
                        index: 1
                    },
                    component: () =>
                        import ('./components/inventory/HasBarCode')
                },
                {
                    path: '/inventory/noBarCode',
                    name: 'inventoryNoBarCode',
                    meta: {
                        index: 1
                    },
                    component: () =>
                        import ('./components/inventory/NoBarCode')
                },
                {
                    path: '/inventory/inboundRecord',
                    name: 'inventoryInboundRecord',
                    meta: {
                        index: 2
                    },
                    component: () =>
                        import ('./components/inventory/InboundRecord')
                },
                {
                    path: '/inventory/outboundRecord',
                    name: 'inventoryOutboundRecord',
                    meta: {
                        index: 2
                    },
                    component: () =>
                        import ('./components/inventory/OutboundRecord')
                },
                {
                    path: '/inventory/disposableItemInbound',
                    name: 'inventoryDisposableItemInbound',
                    meta: {
                        index: 2
                    },
                    component: () =>
                        import ('./components/inventory/DisposableItemInbound')
                },
                {
                    path: '/inventory/disposableItemInboundRecord',
                    name: 'inventoryDisposableItemInboundRecord',
                    meta: {
                        index: 3
                    },
                    component: () =>
                        import ('./components/inventory/DisposableItemInboundRecord')
                },
                {
                    path: '/inventory/productBasicQuantityRequest',
                    name: 'inventoryProductBasicQuantityRequest',
                    meta: {
                        index: 1
                    },
                    component: () =>
                        import ('./components/inventory/ProductBasicQuantityRequest')
                },
                {
                    path: '/inventory/productBasicQuantityCheck',
                    name: 'inventoryProductBasicQuantityCheck',
                    meta: {
                        index: 1
                    },
                    component: () =>
                        import ('./components/inventory/ProductBasicQuantityCheck')
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
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/inventoryCounting/Registration')
            }, {
                path: '/inventoryCounting/record',
                name: 'inventoryCountingRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/inventoryCounting/Record.vue')
            }, {
                path: '/inventoryCounting/disposableProduct',
                name: 'inventoryCountingDisposableProduct',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/inventoryCounting/DisposableProductCounting')
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
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/track/PatientTrack')
            }, {
                path: '/track/opration',
                name: 'trackOpration',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/track/OprationalLog')
            }, {
                path: '/track/package',
                name: 'trackPackage',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/track/PackageTrack')
            }, {
                path: '/track/DisposableProduct',
                name: 'trackDisposableProduct',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/track/DisposableProduct')
            }, {
                path: '/track/singleRecall',
                name: 'trackSingleRecall',
                meta: {
                    index: 2
                },
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
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/provide/Registration')
            }, {
                path: '/provide/record',
                name: 'provideRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/provide/Record')
            }, {
                path: '/provide/borrowRegistration',
                name: 'borrowRegistration',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/provide/BorrowRegistration')
            }, {
                path: '/provide/borrowRecord',
                name: 'borrowRecord',
                meta: {
                    index: 3
                },
                component: () =>
                    import ('./components/provide/BorrowRecord')
            }, {
                path: '/provide/reserveCheck',
                name: 'provideReserveCheck',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/provide/ReserveCheck')
            }, {
                path: '/provide/reserveCheckRecord',
                name: 'provideReserveCheckRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/provide/ReserveCheckRecord')
            }, {
                path: '/provide/reserveChange',
                name: 'provideReserveChange',
                meta: {
                    index: 3
                },
                component: () =>
                    import ('./components/apply/ReserveProduct')
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
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/logistics/SubClinicUsedPackage')
            }, {
                path: '/logistics/driverSchedule',
                name: 'logisticsDriverSchedule',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/logistics/DriverSchedule')
            }, {
                path: '/logistics/driverScheduleRecord',
                name: 'logisticsDriverScheduleRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/logistics/Record')
            }, {
                path: '/logistics/look',
                name: 'logisticsLook',
                meta: {
                    index: 1
                },
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
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/apply/Registration')
            }, {
                path: '/apply/record',
                name: 'applyRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/apply/Record')
            }, {
                path: '/apply/unqualifiedPackageRegistration',
                name: 'UnqualifiedPackageRegistration',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/apply/UnqualifiedPackageRegistration')
            }, {
                path: '/apply/unqualifiedRecord',
                name: 'unqualifiedRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/apply/UnqualifiedRecord')
            }, {
                path: '/apply/putInInventory',
                name: 'applyPutInInventory',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/apply/PutInInventory')
            }, {
                path: '/apply/putInInventoryRecord',
                name: 'applyPutInInventoryRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/apply/PutInInventoryRecord')
            }, {
                path: '/apply/reserve',
                name: 'applyReserve',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/apply/ReserveProduct')
            }, {
                path: '/apply/reserveRecord',
                name: 'applyReserveRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/apply/ReserveProductRecord')
            }, {
                path: '/apply/recycleInClinic',
                name: 'applyRecycleInClinic',
                meta: {
                    index: 1,
                },
                component: () =>
                    import ('./components/apply/RecycleInClinic.vue')
            }]
        },
        {
            path: '/login',
            name: 'login',
            meta: {
                index: -1
            },
            component: () =>
                import ('./components/login/Login')
        },
        {
            path: '/test',
            name: 'test',
            meta: {
                index: 1,
            },
            component: () =>
                import ('./components/temp/test')
        },
        {
            path: '/test2',
            name: 'test2',
            meta: {
                index: 1,
            },
            component: () =>
                import ('./components/temp/test2')
        },
        {
            path: '/management',
            name: 'management',
            meta: {
                index: 1
            },
            component: () =>
                import ('./components/management/ControlPlat'),
            children: [{
                    path: '/management/control',
                    name: 'managementControl',
                    meta: {
                        index: 1
                    },
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
                },
                {
                    path: '/management/configure',
                    name: 'managementConfigure',
                    component: () =>
                        import ('./components/management/Configure')
                },
                {
                    path: '/management/schedulingWorkSheet',
                    name: 'schedulingWorkSheet',
                    component: () =>
                        import ('./components/management/WorkSheetList')
                },
                {
                    path: '/management/dailyWorkSheet',
                    name: 'dailyWorkSheet',
                    component: () =>
                        import ('./components/management/DailyWorkSheet')
                },
                {
                    path: '/management/vacationSchedule',
                    name: 'vacationSchedule',
                    component: () =>
                        import ('./components/management/VacationSchedule')
                },
                {
                    path: '/management/vacationScheduleView',
                    name: 'vacationScheduleView',
                    component: () =>
                        import ('./components/management/VacationScheduleView')
                }, {
                    path: '/management/workLoad',
                    name: 'workLoad',
                    component: () =>
                        import ('./components/management/WorkLoad')
                }
            ]
        },
        {
            path: '/publicModule',
            name: 'publicModule',
            component: () =>
                import ('./components/publicModule/Basic'),
            children: [{
                path: '/publicModule/reprint',
                name: 'publicModuleReprint',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/publicModule/Reprint')
            }, {
                path: '/publicModule/instrumentReplenishment',
                name: 'publicModuleInstrumentReplenishment',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/publicModule/InstrumentReplenishment')
            }, {
                path: '/publicModule/instrumentReplenishmentRecord',
                name: 'publicModuleInstrumentReplenishmentRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/publicModule/InstrumentReplenishmentRecord')
            }]
        },
        {
            path: '/expendables',
            name: 'expendables',
            component: () =>
                import ('./components/expendablesManagement/Basic'),
            children: [{
                path: '/expendables/request',
                name: 'expendablesRequest',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/expendablesManagement/ExpendablesRequest')
            }, {
                path: '/expendables/requestRecord',
                name: 'expendablesRequestRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/expendablesManagement/ExpendablesRequestRecord')
            }, {
                path: '/expendables/receive',
                name: 'expendablesReceive',
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/expendablesManagement/ExpendablesReceive')
            }, {
                path: '/expendables/receiveRecord',
                name: 'expendablesReceiveRecord',
                meta: {
                    index: 2
                },
                component: () =>
                    import ('./components/expendablesManagement/ExpendablesReceiveRecord')
            }]

        },
        {
            path: '/help',
            name: 'help',
            component: () =>
                import ("./components/help/Basic"),
            children: [{
                path: '/help/userManual',
                name: 'helpUserManual',
                component: () =>
                    import ('./components/help/UserManual')
            }]
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
});
router.beforeEach((to, from, next) => {
    if (from.meta.index === undefined) {
        //reload路由判断层级  reload的from.meta没有key
        Vue.prototype.transitionEnterName = "slideInRight";
        Vue.prototype.transitionLeaveName = "slideOutLeft";
        next();
    } else {
        if (to.query.recordId || from.query.recordId) {
            //记录修改判路由层级 记录修改与记录路由层级相等 记录修改的key：query有recordId
            if (to.query.recordId) {
                Vue.prototype.transitionEnterName = "slideInRight";
                Vue.prototype.transitionLeaveName = "slideOutLeft";
                next();
            } else {
                Vue.prototype.transitionEnterName = "slideInLeft";
                Vue.prototype.transitionLeaveName = "slideOutRight";
                next();
            }
        } else {
            if (to.meta.index > from.meta.index) {
                Vue.prototype.transitionEnterName = "slideInRight";
                Vue.prototype.transitionLeaveName = "slideOutLeft";
                next();
            } else {
                Vue.prototype.transitionEnterName = "slideInLeft";
                Vue.prototype.transitionLeaveName = "slideOutRight";
                next();
            }
        }
    }
})
export default router;