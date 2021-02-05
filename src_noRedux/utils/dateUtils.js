/* 包含n个日期时间处理的工具函数模块 */

//格式化日期：yyyy-mm-dd hh:mm:ss
export function formatDate(time){
  if(!time) return ''

  let date = new Date(time)
  let yyyy = date.getFullYear()
  let mm = date.getMonth()+1
  let dd = date.getDate()
  let hour = date.getHours()
  let min = date.getMinutes()
  let sec = date.getSeconds()

  let dateArr = [mm,dd,hour,min,sec]
  dateArr = dateArr.map((item,index)=>{
    if(item>=0 && item<10){
      item = '0' + item
    }
    return item
  })
  return yyyy+'-'+dateArr[0]+'-'+dateArr[1]+' '+dateArr[2]+':'+dateArr[3]+':'+dateArr[4]
}

//教程代码：yyyy-m-d h:m:s
/* export function formateDateOri(time) {
  if (!time) return ''
  let date = new Date(time)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
} */
