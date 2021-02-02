/* 用来指定商品详情的富文本编辑器组件 */
import React,{ Component } from "react";
import PropTypes from 'prop-types'
import { Editor } from "react-draft-wysiwyg";
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default class RichTextEditor extends Component{
  static propTypes = {
    detail: PropTypes.string //接收到的detail属性为string类型
  }
  // state = {
  //   editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
  // }
  constructor(props){
    super(props)
    const html = this.props.detail
    if(html){ //如果html有值【修改商品】
      const contentBlock = htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = { //初始化状态
        editorState, //根据html格式字符串 创建一个对应的编辑对象
      }
    }else{ //如果没有值【添加商品】
      this.state = { //初始化状态
        editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
      }
    }
  }
  //输入过程中实时的回调
  onEditorStateChange = (editorState)=>{
    this.setState({editorState,})
  }
  //获取输入框中的数据(商品详情)
  getDetail = ()=>{
    //返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  //添加本地图片
  uploadImageCallBack = (file)=>{
    return new Promise(
      (resolve,reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST','/manage/img/upload')
        const data = new FormData()
        data.append('image',file)
        xhr.send(data)
        xhr.addEventListener('load',()=>{
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url //得到图片的url
          resolve({data:{link:url}})
        })
        xhr.addEventListener('error',()=>{
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }
  render(){
    const {editorState} = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle={{border:'1px solid #F1F1F1',minHeight:150,paddingLeft:10}}
        placeholder={'输入商品详情'}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {uploadCallback: this.uploadImageCallBack,
          alt: {present: true, mandatory: true}},
        }}
      />
    )
  }
}


