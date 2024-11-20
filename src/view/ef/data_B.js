let dataB = {
    name: '孔明锁-先车后铣',
    nodeList: [
        {
            id: '1',
            type: 'params',
            name: '路径参数设置',
            ico: 'iconfont icon-params',
            left: '40px',
            top: '150px',
            // 自定义覆盖样式
            style: {}
        },
        {
            id: '2',
            type: 'Order-outbound',
            name: '订单出库',
            ico: 'iconfont icon-dingdanchuku',
            left: '340px',
            top: '150px',
            // 自定义覆盖样式
            style: {}
        },
        {
            id: '3',
            type: 'Material_Warehouse>>Lathe',
            name: '料库>>>车床',
            ico: 'el-icon-caret-right',
            left: '640px',
            top: '150px',
            // 自定义覆盖样式
            style: {}
        },
        {
            id: '4',
            type: 'lathe',
            name: '车床加工',
            ico: 'iconfont icon-chechuang',
            left: '960px',
            top: '150px',
            // 自定义覆盖样式
            style: {}
        },
        {
            id: '5',
            type: 'Lathe>>>Milling_machine',
            name: '车床>>>铣床',
            ico: 'el-icon-caret-right',
            left: '40px',
            top: '350px',
            // 自定义覆盖样式
            style: {}
        },
        {
            id: '6',
            type: 'milling-machine',
            name: '铣床加工',
            ico: 'iconfont icon-xianchuang',
            left: '340px',
            top: '350px',
            // 自定义覆盖样式
            style: {}
        },
        {
            id: '7',
            type: 'Milling_machine>>>Inspection',
            name: '铣床>>>检测',
            ico: 'el-icon-caret-right',
            left: '640px',
            top: '350px',
            // 自定义覆盖样式
            style: {}
        },
        {
            id: '8',
            type: 'detection',
            name: '视觉检测',
            ico: 'iconfont icon-jianceshiyan',
            left: '960px',
            top: '350px',
            // 自定义覆盖样式
            style: {}
        },
        {
            id: '9',
            type: 'milling-machine',
            name: '铣床加工',
            ico: 'iconfont icon-xianchuang',
            left: '960px',
            top: '450px',
            // 自定义覆盖样式
            style: {}
        }
    ],
    lineList: [{
        from: '1',
        to: '2'
    }, {
        from: '2',
        to: '3'
    }, {
        from: '3',
        to: '4'
    }, {
        from: '4',
        to: '5'
    }, {
        from: '5',
        to: '6'
    }, {
        from: '6',
        to: '7'
    }, {
        from: '7',
        to: '8'
    }, {
        from: '8',
        to: '9'
    }
    ]
}

export function getDataB () {
    return dataB
}
