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
            path: '/basic',
            name: 'basic',
            meta: { index: 1 },
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
                meta: {
                    index: 1
                },
                component: () =>
                    import ('./components/recovery/Registration')
            }, {
                path: '/recovery/record',
                name: 'record',
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
                    name: 'taskList',
                    meta: {
                        index: 1
                    },
                    component: () =>
                        import ('./components/package/TaskList')
                },
                {
                    path: '/package/taskRecord',
                    name: 'taskRecord',
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
                path: '/sterilize/checkRecord',
                name: 'checkRecord',
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
                path: '/provice/reserveChange',
                name: 'provideReserveChange',
                meta: {
                    index: 3
                },
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
            component: () =>
                import ('./components/temp/test')
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
            }]
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