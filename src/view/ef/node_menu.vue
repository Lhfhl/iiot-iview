<template>
    <div class="flow-menu" ref="tool">
        <div v-for="menu  in  menuList" :key="menu.id">
            <span class="ef-node-pmenu" @click="menu.open = !menu.open"><i :class="{'el-icon-caret-bottom': menu.open,'el-icon-caret-right': !menu.open}"></i>&nbsp;{{menu.name}}</span>
            <ul v-show="menu.open" class="ef-node-menu-ul">
                <draggable @end="end" @start="move" v-model="menu.children" :options="draggableOptions">
                    <li v-for="subMenu in menu.children" class="ef-node-menu-li" :key="subMenu.id" :type="subMenu.type">
                        <i :class="subMenu.ico" ></i> {{subMenu.name}}
                    </li>
                </draggable>
            </ul>
        </div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import '@/view/ef/index.css'
    var mousePosition = {
        left: -1,
        top: -1
    }

    export default {
        data () {
            return {
                activeNames: '1',
                // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
                draggableOptions: {
                    preventOnFilter: false,
                    sort: false,
                    disabled: false,
                    ghostClass: 'tt',
                    // 不使用H5原生的配置
                    forceFallback: true,
                    // 拖拽的时候样式
                    // fallbackClass: 'flow-node-draggable'
                },
                // 默认打开的左侧菜单的id
                defaultOpeneds: ['1', '2'],
                menuList: [
                    {
                        id: '1',
                        type: 'group',
                        name: '节点类别1',
                        ico: 'el-icon-video-play',
                        open: true,
                        children: [
                            {
                                id: '11',
                                type: 'Order-outbound',
                                name: '订单出库',
                                ico: 'iconfont icon-dingdanchuku',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '12',
                                type: 'Material-warehouse',
                                name: '料库',
                                ico: 'iconfont icon-cangku_kucun_o',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '13',
                                type: 'assemble',
                                name: '组装',
                                ico: 'iconfont icon-zuzhuangchaixie',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '14',
                                type: 'Warehousing',
                                name: '入库',
                                ico: 'iconfont icon-icon_function_kuaisuruku',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '15',
                                type: 'lathe',
                                name: '车床加工',
                                ico: 'iconfont icon-chechuang',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '16',
                                type: 'milling-machine',
                                name: '铣床加工',
                                ico: 'iconfont icon-xianchuang',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '17',
                                type: 'detection',
                                name: '视觉检测',
                                ico: 'iconfont icon-jianceshiyan',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '18',
                                type: 'params',
                                name: '路径参数设置',
                                ico: 'iconfont icon-params',
                                // 自定义覆盖样式
                                style: {}
                            }
                        ]
                    },
                    {
                        id: '2',
                        type: 'group',
                        name: '节点类别2',
                        ico: 'el-icon-video-pause',
                        open: true,
                        children: [
                            {
                                id: '21',
                                type: 'Material_Warehouse>>Lathe',
                                name: '料库>>>车床',
                                ico: 'el-icon-caret-right',
                                // 自定义覆盖样式
                                style: {
                                }
                            },
                            {
                                id: '22',
                                type: 'Lathe>>>Milling_machine',
                                name: '车床>>>铣床',
                                ico: 'el-icon-caret-right',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '23',
                                type: 'Milling_machine>>>Inspection',
                                name: '铣床>>>检测',
                                ico: 'el-icon-caret-right',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '24',
                                type: 'Material Warehouse>>>Milling Machine',
                                name: '料库>>>铣床',
                                ico: 'el-icon-caret-right',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '25',
                                type: 'Milling_machine>>>Lathe',
                                name: '铣床>>>车床',
                                ico: 'el-icon-caret-right',
                                // 自定义覆盖样式
                                style: {}
                            },
                            {
                                id: '26',
                                type: 'Lathe>>>Inspection',
                                name: '车床>>>检测',
                                ico: 'el-icon-caret-right',
                                // 自定义覆盖样式
                                style: {}
                            }
                        ]
                    }
                ],
                nodeMenu: {}
            }
        },
        components: {
            draggable
        },
        created () {
            /**
             * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
             * @param event
             */
            if (this.isFirefox()) {
                document.body.ondrop = function (event) {
                    // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
                    mousePosition.left = event.layerX
                    mousePosition.top = event.clientY - 50
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },
        methods: {
            // 根据类型获取左侧菜单对象
            getMenuByType (type) {
                for (let i = 0; i < this.menuList.length; i++) {
                    let children = this.menuList[i].children;
                    for (let j = 0; j < children.length; j++) {
                        if (children[j].type === type) {
                            return children[j]
                        }
                    }
                }
            },
            // 拖拽开始时触发
            move (evt, a, b, c) {
                var type = evt.item.attributes.type.nodeValue
                this.nodeMenu = this.getMenuByType(type)
            },
            // 拖拽结束时触发
            end (evt, e) {
                this.$emit('addNode', evt, this.nodeMenu, mousePosition)
            },
            // 是否是火狐浏览器
            isFirefox () {
                var userAgent = navigator.userAgent
                if (userAgent.indexOf("Firefox") > -1) {
                    return true
                }
                return false
            }
        }
    }
</script>
