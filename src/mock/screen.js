/* eslint-disable no-unused-vars */
import Mock from 'mockjs'
// 延时200-600毫秒请求到数据
console.log('Mock.js 已初始dasihsjkah化')
Mock.setup({
  timeout: '200-600'
})

const Random = Mock.Random
// 环境参数
function countDeviceNum () {
  const a = Mock.mock({
    success: true,
    data: {
      offlineNum: '@integer(1, 100)',
      lockNum: '@integer(1, 10)',
      totalNum: 218
    }
  })
  a.data.onlineNum = a.data.totalNum - a.data.offlineNum - a.data.lockNum
  return a
}

// 接口，第一个参数url，第二个参数请求类型，第三个参数响应回调
Mock.mock(new RegExp('countDeviceNum'), 'get', countDeviceNum)

// /设备总览

function environmentNum () {
  const a = Mock.mock({
    success: true,
    data: {
      beamNum: '@integer(300, 400)',
      dustNum: '@integer(20, 50)',
      temperatureNum: '@integer(24, 25)',
      humidityNum: '@integer(26%, 28%)'
      // onlineNum: '@integer(0, 50)'
    }
  })

  return a
}

Mock.mock(new RegExp('environmentNum'), 'get', environmentNum)

// /设备提醒

function sbtx () {
  const a = Mock.mock({
    success: true,
    data: {
      'list|20': [
        {
          'deviceinformation|1': ['拼接', '切割', '制作'],
          createTime: "@datetime('yyyy-MM-dd HH:mm:ss')",
          deviceId: '6c512d754bbcd6d7cd86abce0e0cac58',
          'gatewayno|+1': 10000,
          'onlineState|1': [0, 1]

        }
      ]
    }
  })
  return a
}

Mock.mock(new RegExp('sbtx'), 'get', sbtx)

// // 中间地图

// function centermap (options) {
//   let params = parameteUrl(options.url)
//   if (params.regionCode && params.regionCode != 'china') {
//     const a = Mock.mock({
//       success: true,
//       data: {
//         'dataList|30': [
//           {
//             name: '@city()',
//             value: '@integer(1, 1000)'
//           }
//         ],
//         regionCode: params.regionCode// -代表中国
//       }
//     })
//     return a
//   } else {
//     const a = Mock.mock({
//       success: true,
//       data: {
//         'dataList|8': [
//           {
//             name: '@province()',
//             value: '@integer(1, 1000)'
//           }
//         ],
//         regionCode: 'china'
//       }
//     })
//     return a
//   }
// }

// Mock.mock(new RegExp('centermap'), 'get', centermap)

// 报警

function alarmNum () {
  const a = Mock.mock({
    success: true,
    data: {
      dateList: ['2021-11', '2021-12', '2022-01', '2022-02', '2022-03', '2022-04'],
      'numList|6': [
        '@integer(0, 1000)'
      ],
      'numList2|6': [
        '@integer(0, 1000)'
      ]
    }
  })
  return a
}
Mock.mock(new RegExp('alarmNum'), 'get', alarmNum)

// 订单信息

function information () {
  const a = Mock.mock({
    success: true,
    data: {
      'list|40': [{
        detail: '孔明锁',
        // 'alertname|1': ['水浸告警', '各种报警'],
        value: '@float(60, 200)',
        createtime: '2022-04-19 08:38:33',
        deviceid: null,
        'gatewayno|+1': 10000,
        phase: 'A1',
        // sbInfo: '孔明锁',
        'terminalno|+1': 100,
        provinceName: '北京市',
        cityName: '海淀区',
        countyName: '北太平庄'
      }]

    }
  })
  return a
}
Mock.mock(new RegExp('information'), 'get', information)

// 生产安排
function producePlan () {
  let num = RandomNumBoth(26, 32)
  const startDate = new Date(2020, 0, 1) // 开始日期
  const endDate = new Date(2023, 11, 31) // 结束日期

  // 随机生成日期并排序
  const generateRandomDates = (count) => {
    let dates = []
    for (let i = 0; i < count; i++) {
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
      dates.push(randomDate.toISOString().split('T')[0]) // 格式化为 YYYY-MM-DD
    }
    return dates.sort() // 按日期升序排序
  }

  const dates = generateRandomDates(num) // 生成随机日期

  const a = Mock.mock({
    ['barData|' + num]: ['@integer(10, 100)'] // 生成柱状图数据
  })

  // eslint-disable-next-line one-var
  let lineData = [],
    rateData = []
  for (let index = 0; index < num; index++) {
    let lineNum = Mock.mock('@integer(0, 100)') + a.barData[index]
    lineData.push(lineNum)
    let rate = a.barData[index] / lineNum
    rateData.push((rate * 100).toFixed(0))
  }

  a.category = dates // 使用生成的升序随机日期作为分类
  a.lineData = lineData
  a.rateData = rateData

  return {
    success: true,
    data: a
  }
}
Mock.mock(new RegExp('producePlan'), 'get', producePlan)

function information1 () {
  // 多生成几个避免重复 重复会报错
  let num = Mock.mock({ 'list|48': [{ value: '@integer(50,1000)', name: '@city()' }] }).list
  //   console.log(num);
  // eslint-disable-next-line one-var
  let newNum = [], numObj = {}
  num.map(item => {
    if (!numObj[item.name] && newNum.length<8) {
      numObj[item.name] = true
      newNum.push(item)
    }
  })
  let arr = newNum.sort((a, b) => {
    return b.value - a.value
  })
  let a = {
    success: true,
    data: arr
  }
  return a
}
Mock.mock(new RegExp('information1'), 'get', information1)
/**
 * @description: min ≤ r ≤ max  随机数
 * @param {*} Min
 * @param {*} Max
 * @return {*}
 */
function RandomNumBoth (Min, Max) {
  var Range = Max - Min
  var Rand = Math.random()
  var num = Min + Math.round(Rand * Range) // 四舍五入
  return num
}
/**
 * @description: 获取路径参数
 * @param {*} url
 * @return {*}
 */
function parameteUrl (url) {
  var json = {}
  if (/\?/.test(url)) {
    var urlString = url.substring(url.indexOf('?') + 1)
    var urlArray = urlString.split('&')
    for (var i = 0; i < urlArray.length; i++) {
      var urlItem = urlArray[i]
      var item = urlItem.split('=')
      console.log(item)
      json[item[0]] = item[1]
    }
    return json
  }
  return {}
}
