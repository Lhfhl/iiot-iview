<template>
    <div v-if="easyFlowVisible" style="height: calc(100vh - 120px);">
        <div class="custom-card">
            <el-row>
                <!--顶部工具菜单-->
                <el-col :span="24">
                    <div class="ef-tooltar">
                        <el-link type="primary" :underline="false" style="margin-bottom: 5px;">{{ data.name }}</el-link>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" icon="el-icon-delete" size="large" @click="deleteElement"
                            :disabled="!this.activeElement.type"></el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip class="item" effect="dark" content="根据当前流程下单生产" placement="top-start">
                            <el-button type="text" icon="el-icon-download" size="large"
                                @click="downloadData"></el-button>
                        </el-tooltip>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" icon="el-icon-plus" size="large" @click="zoomAdd"></el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" icon="el-icon-minus" size="large" @click="zoomSub"></el-button>
                        <div style="float: right;margin-right: 5px">
                            <el-button type="info" plain round icon="el-icon-document" @click="dataInfo" size="mini"
                                style="">流程信息</el-button>
                            <el-button type="primary" plain round @click="dataReloadA" icon="el-icon-refresh"
                                size="mini" style="">新建流程</el-button>
                            <el-button type="primary" plain round @click="dataReloadB" icon="el-icon-refresh"
                                size="mini" style="">孔明锁-先车后铣</el-button>
                            <el-button type="primary" plain round @click="dataReloadC" icon="el-icon-refresh"
                                size="mini" style="">孔明锁-先铣后车</el-button>
                            <el-button type="info" plain round icon="el-icon-document" @click="openHelp" size="mini"
                                style="">帮助</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div style="display: flex;height: calc(100% - 47px);">
                <!-- 左侧节点栏 -->
                <div style="width: 150px;border-right: 1px solid #dce3e8;">
                    <node-menu @addNode="addNode" ref="nodeMenu"></node-menu>
                </div>
                <div id="efContainer" ref="efContainer" class="container" v-flowDrag>
                    <template v-for="node in data.nodeList">
                        <flow-node :id="node.id" :key="node.id" :node="node" :activeElement="activeElement"
                            @changeNodeSite="changeNodeSite" @nodeRightMenu="nodeRightMenu" @clickNode="clickNode">
                        </flow-node>
                    </template>
                    <!-- 给画布一个默认的宽度和高度 -->
                    <div style="position:absolute;top: 2000px;left: 2000px;">&nbsp;</div>
                </div>
                <!-- 右侧表单，可以编辑节点信息 -->
                <!-- <div style="width: 300px;border-left: 1px solid #dce3e8;background-color: #FBFBFB">
                <flow-node-form ref="nodeForm" @setLineLabel="setLineLabel" @repaintEverything="repaintEverything"></flow-node-form>
            </div> -->
            </div>
        </div>


        <!-- 流程数据详情 -->
        <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
        <flow-help v-if="flowHelpVisible" ref="flowHelp"></flow-help>
        <!-- 信息模型对话框 -->
        <el-dialog title="信息模型展示" :visible.sync="showDialog" @confirm="handleDialogConfirm" @close="handleDialogClose">
            <XmlDataDisplay :fileNames="modifiedFileNames" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleDialogClose">确定生产</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    const axios = require('axios');
    // import { jsPlumb } from 'jsplumb'
    // 使用修改后的jsplumb
    import './jsplumb'
    import { easyFlowMixin } from '@/view/ef/mixins.js'
    import flowNode from '@/view/ef/node.vue'
    import nodeMenu from '@/view/ef/node_menu.vue'
    import FlowInfo from '@/view/ef/info.vue'
    import FlowHelp from '@/view/ef/help.vue'
    import FlowNodeForm from './node_form.vue'
    import lodash from 'lodash'
    import { getDataA } from './data_A.js'
    import { getDataB } from './data_B.js'
    import { getDataC } from './data_C.js'
    import { getDataD } from './data_D.js'
    import { ForceDirected } from './force-directed.js'
    import Swal from 'sweetalert2';
    import XmlDataDisplay from '@/view/ef/XmlDataDisplay.vue'; // 根据实际路径调整
    import '@/view/ef/index.css'
    export default {
        data () {
            return {
                // jsPlumb 实例
                jsPlumb: null,
                // 控制画布销毁
                easyFlowVisible: true,
                // 控制流程数据显示与隐藏
                flowInfoVisible: false,
                // 是否加载完毕标志位
                loadEasyFlowFinish: false,
                flowHelpVisible: false,
                // 数据
                data: {},
                // 激活的元素、可能是节点、可能是连线
                activeElement: {
                    // 可选值 node 、line
                    type: undefined,
                    // 节点ID
                    nodeId: undefined,
                    // 连线ID
                    sourceId: undefined,
                    targetId: undefined
                },
                zoom: 0.5,
                // 节点的name数组
                namesArray: [],
                showDialog: false, // 控制对话框显示的变量
                resolveDialogPromise: null
            }
        },
        // 一些基础配置移动该文件中
        mixins: [easyFlowMixin],
        components: {
            draggable, flowNode, nodeMenu, FlowInfo, FlowNodeForm, FlowHelp,XmlDataDisplay
        },
        // 把“>>>”转换为“_”
        computed: {
            modifiedFileNames() {
            return this.namesArray.map(name => name.replace(/>>>/g, '_'));
            }
        },
        directives: {
            'flowDrag': {
                bind (el, binding, vnode, oldNode) {
                    if (!binding) {
                        return
                    }
                    el.onmousedown = (e) => {
                        if (e.button == 2) {
                            // 右键不管
                            return
                        }
                        //  鼠标按下，计算当前原始距离可视区的高度
                        let disX = e.clientX
                        let disY = e.clientY
                        el.style.cursor = 'move'

                        document.onmousemove = function (e) {
                            // 移动时禁止默认事件
                            e.preventDefault()
                            const left = e.clientX - disX
                            disX = e.clientX
                            el.scrollLeft += -left

                            const top = e.clientY - disY
                            disY = e.clientY
                            el.scrollTop += -top
                        }

                        document.onmouseup = function (e) {
                            el.style.cursor = 'auto'
                            document.onmousemove = null
                            document.onmouseup = null
                        }
                    }
                }
            }
        },
        mounted () {
            this.jsPlumb = jsPlumb.getInstance()
            this.$nextTick(() => {
                // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
                this.dataReload(getDataA())
            })
        },
        methods: {
            // 返回唯一标识
            getUUID () {
                return Math.random().toString(36).substr(3, 10)
            },
            jsPlumbInit () {
                this.jsPlumb.ready(() => {
                    // 导入默认配置
                    this.jsPlumb.importDefaults(this.jsplumbSetting)
                    // 会使整个jsPlumb立即重绘。
                    this.jsPlumb.setSuspendDrawing(false, true);
                    // 初始化节点
                    this.loadEasyFlow()
                    // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
                    this.jsPlumb.bind('click', (conn, originalEvent) => {
                        this.activeElement.type = 'line'
                        this.activeElement.sourceId = conn.sourceId
                        this.activeElement.targetId = conn.targetId
                        // this.$refs.nodeForm.lineInit({
                        //     from: conn.sourceId,
                        //     to: conn.targetId,
                        //     label: conn.getLabel()
                        // })
                    })
                    // 连线
                    this.jsPlumb.bind('connectionDetached', (evt) => {
                        let from = evt.source.id
                        let to = evt.target.id
                        if (this.loadEasyFlowFinish) {
                            this.data.lineList.push({from: from, to: to})
                        }
                    })

                    // 删除连线回调
                    this.jsPlumb.bind('connectionDetached', (evt) => {
                        this.deleteLine(evt.sourceId, evt.targetId)
                    })

                    // 改变线的连接节点
                    this.jsPlumb.bind('connectionMoved', (evt) => {
                        this.changeLine(evt.originalSourceId, evt.originalTargetId)
                    })

                    // 连线右击
                    this.jsPlumb.bind('contextmenu', (evt) => {
                        console.log('contextmenu', evt)
                    })

                    // 连线
                    this.jsPlumb.bind('beforeDrop', (evt) => {
                        let from = evt.sourceId
                        let to = evt.targetId
                        if (from === to) {
                            this.$message.error('节点不支持连接自己')
                            return false
                        }
                        if (this.hasLine(from, to)) {
                            this.$message.error('该关系已存在,不允许重复创建')
                            return false
                        }
                        if (this.hashOppositeLine(from, to)) {
                            this.$message.error('不支持两个节点之间连线回环');
                            return false
                        }
                        this.$message.success('连接成功')
                        return true
                    })

                    // beforeDetach
                    this.jsPlumb.bind('beforeDetach', (evt) => {
                        console.log('beforeDetach', evt)
                    })
                    this.jsPlumb.setContainer(this.$refs.efContainer)
                })
            },
            // 加载流程图
            loadEasyFlow () {
                // 初始化节点
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    // 设置源点，可以拖出线连接其他节点
                    this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
                    // // 设置目标点，其他源点拖出的线可以连接该节点
                    this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                    if (!node.viewOnly) {
                        this.jsPlumb.draggable(node.id, {
                            containment: 'parent',
                            stop: function (el) {
                                // 拖拽节点结束后的对调
                                console.log('拖拽结束: ', el)
                            }
                        })
                    }
                }
                // 初始化连线
                for (var i = 0; i < this.data.lineList.length; i++) {
                    let line = this.data.lineList[i]
                    var connParam = {
                        source: line.from,
                        target: line.to,
                        label: line.label ? line.label : '',
                        connector: line.connector ? line.connector : '',
                        anchors: line.anchors ? line.anchors : undefined,
                        paintStyle: line.paintStyle ? line.paintStyle : undefined,
                    }
                    this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
                }
                this.$nextTick(function () {
                    this.loadEasyFlowFinish = true
                })
            },
            // 设置连线条件
            setLineLabel (from, to, label) {
                var conn = this.jsPlumb.getConnections({
                    source: from,
                    target: to
                })[0]
                if (!label || label === '') {
                    conn.removeClass('flowLabel')
                    conn.addClass('emptyFlowLabel')
                } else {
                    conn.addClass('flowLabel')
                }
                conn.setLabel({
                    label: label,
                })
                this.data.lineList.forEach(function (line) {
                    if (line.from == from && line.to == to) {
                        line.label = label
                    }
                })

            },
            // 删除激活的元素
            deleteElement () {
                if (this.activeElement.type === 'node') {
                    this.deleteNode(this.activeElement.nodeId)
                } else if (this.activeElement.type === 'line') {
                    this.$confirm('确定删除所点击的线吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var conn = this.jsPlumb.getConnections({
                            source: this.activeElement.sourceId,
                            target: this.activeElement.targetId
                        })[0]
                        this.jsPlumb.deleteConnection(conn)
                    }).catch(() => {
                    })
                }
            },
            // 删除线
            deleteLine (from, to) {
                this.data.lineList = this.data.lineList.filter(function (line) {
                    if (line.from == from && line.to == to) {
                        return false
                    }
                    return true
                })
            },
            // 改变连线
            changeLine (oldFrom, oldTo) {
                this.deleteLine(oldFrom, oldTo)
            },
            // 改变节点的位置
            changeNodeSite (data) {
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    if (node.id === data.nodeId) {
                        node.left = data.left
                        node.top = data.top
                    }
                }
            },
            /**
             * 拖拽结束后添加新的节点
             * @param evt
             * @param nodeMenu 被添加的节点对象
             * @param mousePosition 鼠标拖拽结束的坐标
             */
            addNode (evt, nodeMenu, mousePosition) {
                var screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
                let efContainer = this.$refs.efContainer
                var containerRect = efContainer.getBoundingClientRect()
                var left = screenX, top = screenY
                // 计算是否拖入到容器中
                if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
                    this.$message.error('请把节点拖入到画布中')
                    return
                }
                left = left - containerRect.x + efContainer.scrollLeft
                top = top - containerRect.y + efContainer.scrollTop
                // 居中
                left -= 85
                top -= 16
                var nodeId = this.getUUID()
                // 动态生成名字
                var origName = nodeMenu.name
                var nodeName = origName
                var index = 1
                while (index < 10000) {
                    var repeat = false
                    for (var i = 0; i < this.data.nodeList.length; i++) {
                        let node = this.data.nodeList[i]
                        if (node.name === nodeName) {
                            nodeName = origName + index
                            repeat = true
                        }
                    }
                    if (repeat) {
                        index++
                        continue
                    }
                    break
                }
                var node = {
                    id: nodeId,
                    name: nodeName,
                    type: nodeMenu.type,
                    left: left + 'px',
                    top: top + 'px',
                    ico: nodeMenu.ico,
                    state: 'success'
                }
                /**
                 * 这里可以进行业务判断、是否能够添加该节点
                 */
                this.data.nodeList.push(node)
                this.$nextTick(function () {
                    this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
                    this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(nodeId, {
                        containment: 'parent',
                        stop: function (el) {
                            // 拖拽节点结束后的对调
                            console.log('拖拽结束: ', el)
                        }
                    })
                })
            },
            /**
             * 删除节点
             * @param nodeId 被删除节点的ID
             */
            deleteNode (nodeId) {
                this.$confirm('确定要删除节点' + nodeId + '?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    /**
                     * 这里需要进行业务判断，是否可以删除
                     */
                    this.data.nodeList = this.data.nodeList.filter(function (node) {
                        if (node.id === nodeId) {
                            // 伪删除，将节点隐藏，否则会导致位置错位
                            // node.show = false
                            return false
                        }
                        return true
                    })
                    this.$nextTick(function () {
                        this.jsPlumb.removeAllEndpoints(nodeId);
                    })
                }).catch(() => {
                })
                return true
            },
            clickNode (nodeId) {
                this.activeElement.type = 'node'
                this.activeElement.nodeId = nodeId
                // this.$refs.nodeForm.nodeInit(this.data, nodeId)
            },
            // 是否具有该线
            hasLine (from, to) {
                for (var i = 0; i < this.data.lineList.length; i++) {
                    var line = this.data.lineList[i]
                    if (line.from === from && line.to === to) {
                        return true
                    }
                }
                return false
            },
            // 是否含有相反的线
            hashOppositeLine (from, to) {
                return this.hasLine(to, from)
            },
            nodeRightMenu (nodeId, evt) {
                this.menu.show = true
                this.menu.curNodeId = nodeId
                this.menu.left = evt.x + 'px'
                this.menu.top = evt.y + 'px'
            },
            repaintEverything () {
                this.jsPlumb.repaint()
            },
            // 流程数据信息
            dataInfo () {
                this.flowInfoVisible = true
                this.$nextTick(function () {
                    this.$refs.flowInfo.init()
                })
            },
            // 加载流程图
            dataReload (data) {
                this.easyFlowVisible = false
                this.data.nodeList = []
                this.data.lineList = []
                this.$nextTick(() => {
                    data = lodash.cloneDeep(data)
                    this.easyFlowVisible = true
                    this.data = data
                    this.$nextTick(() => {
                        this.jsPlumb = jsPlumb.getInstance()
                        this.$nextTick(() => {
                            this.jsPlumbInit()
                        })
                    })
                })
            },
            // 模拟载入数据dataA
            dataReloadA () {
                this.dataReload(getDataA())
            },
            // 模拟载入数据dataB
            dataReloadB () {
                this.dataReload(getDataB())
            },
            // 模拟载入数据dataC
            dataReloadC () {
                this.dataReload(getDataC())
            },
            // 模拟载入数据dataD
            dataReloadD () {
                this.dataReload(getDataD())
            },
            // // 模拟加载数据dataE，自适应创建坐标
            // dataReloadE () {
            //     let dataE = getDataE()
            //     let tempData = lodash.cloneDeep(dataE)
            //     let data = ForceDirected(tempData)
            //     this.dataReload(data)
            //     this.$message({
            //         message: '力导图每次产生的布局是不一样的',
            //         type: 'warning'
            //     });
            // },
            zoomAdd () {
                if (this.zoom >= 1) {
                    return
                }
                this.zoom = this.zoom + 0.1
                this.$refs.efContainer.style.transform = `scale(${this.zoom})`
                this.jsPlumb.setZoom(this.zoom)
            },
            zoomSub () {
                if (this.zoom <= 0) {
                    return
                }
                this.zoom = this.zoom - 0.1
                this.$refs.efContainer.style.transform = `scale(${this.zoom})`
                this.jsPlumb.setZoom(this.zoom)
            },
            /**
             * 进度展示（都是一样的，固定三秒）
             * 
             */
            progress_bar(){
                return new Promise((resolve) => {
                let timerInterval;
                const totalDuration = 3000; // 总时长为3000毫秒

                Swal.fire({
                    title: "正在生成信息模型!",
                    html: "进度: <b>0%</b>.",
                    timer: totalDuration,
                    // timerProgressBar: true,
                    didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                let startTime = Date.now();

                timerInterval = setInterval(() => {
                    const elapsedTime = Date.now() - startTime;
                    const progress = Math.min(100, Math.round((elapsedTime / totalDuration) * 100));
                    timer.textContent = `${progress}%`;
                }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log("I was closed by the timer");
                    }
                     // 在弹窗关闭后显示加载完成动画
                    // Swal.fire({
                    //     title: '信息模型生成成功!',
                    //     html: '<div class="swal2-complete-animation"></div>',
                    //     icon: 'success',
                    //     confirmButtonText: '确定生产', // 修改确认按钮文字
                    // }).then(() => {
                    // resolve(); // 解析 Promise
                    // });
                    // 设置变量以显示对话框
                    this.showDialog = true;
                    this.resolveDialogPromise = resolve; // 保存 resolve 函数
                });
                });
            },
            handleDialogConfirm() {
                // 处理对话框确认
                this.showDialog = false; // 隐藏对话框
                if (this.resolveDialogPromise) {
                    this.resolveDialogPromise(); // 解析 Promise
                }
            },
            handleDialogClose() {
                // 处理对话框关闭
                this.showDialog = false; // 隐藏对话框
                if (this.resolveDialogPromise) {
                    this.resolveDialogPromise(); // 解析 Promise
                }
            },
            // 生产确定
            downloadData () {
                this.$confirm('确定要使用定制的产线进行生产吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                    customClass: 'Customized_production_line'
                }).then(() => {
                    // var datastr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data, null, '\t'));
                    // 解析 JSON 字符串为 JavaScript 对象
                    var jsonData = this.data;
                    console.log(jsonData)
                    if (jsonData.nodeList.length === 0) {
                        this.$confirm('输入为空，请重新输入', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning',
                        customClass: 'Customized_production_line'
                        });
                        return; // 跳出函数，不执行后续代码
                    }
                    // 提取所有 "name" 字段的值并保存到数组中
                    this.namesArray = jsonData.nodeList.map(function(node) {
                        return node.name;
                    });
                    // 输出保存了所有 "name" 值的数组
                    console.log(this.namesArray);
                    // 将接收到的数据按照逗号隔开并组合成一个字符串
                    const lineDetails = this.namesArray.join(',');
                    // 构造请求体
                    const requestBody = {
                    "lineDetails": lineDetails
                    };
                    // 发送数据到服务器
                    fetch('/api/admin/model/getByLineDetails', {
                        method: 'POST', // 使用 POST 方法发送数据
                        headers: {
                            'Content-Type': 'application/json' // 声明发送的数据是 JSON 格式
                        },
                        body: JSON.stringify(requestBody) // 将 namesArray 数组转换为 JSON 字符串并发送
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json(); // 将响应转换为 JSON
                        }
                        return response.json(); // 如果服务器响应成功，返回响应的 JSON 数据
                    })
                    .then(data => {
                        if (data.code === 1) {
                            /**
                             * 
                             * progress_bar弹窗函数
                             * 
                             */
                            this.progress_bar().then(() => {
                                const id = data.data.id; // 获取返回数据中的 id
                                console.log('ID:', id);
                                // 在这里可以对 ID 进行进一步处理
                                this.startProduction(id);
                            });
                        } else {
                            console.error('Request failed with code:', data.code);
                            // 处理其他错误码
                        }
                        console.log('服务器响应：', data); // 处理服务器的响应数据
                    })
                    .catch(error => {
                        console.error('发生错误：', error); // 处理错误情况
                    });
                }).catch(() => {
                })
            },
            openHelp () {
                this.flowHelpVisible = true
                this.$nextTick(function () {
                    this.$refs.flowHelp.init()
                })
            },

            async startProduction(id) {
                try {
                // 发起请求开始生产
                await axios.get(`/api/admin/order/order/${id}`);
                console.log('开始生产成功');
                // 添加成功提示，例如使用 Element UI 的 Message 组件
                this.$message.success('下单成功，开始生产');
                // 导航到订单管理页面
                    this.$router.push({ name: 'ordermanagement' });
                } catch (error) {
                console.error('开始生产失败', error);
                // 添加失败提示，例如使用 Element UI 的 Message 组件
                this.$message.error('开始生产失败，请稍后重试');
                }
            }
        }
    }
</script>
