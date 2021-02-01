/* 用于图片上传的组件 */
import React from 'react'
import PropTypes from "prop-types";
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { reqDeleteImg } from "../../api";
import {BASE_IMG_URL, UPLOAD_IMG_NAME} from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  constructor(props){
    super(props)
    let fileList = []
    //如果传入了imgs属性
    const {imgs} = this.props
    if(imgs && imgs.length>0){
      fileList = imgs.map((img,index) => ({
        uid: -index, //每个file都有自己唯一的id(建议使用负值 以免和其他id产生冲突)
        name: img, //图片文件名
        status: 'done', //图片状态:done上传成功 uploading上传中 error上传错误
        url: BASE_IMG_URL + img //图片地址
      }))
    }
    //初始化状态
    this.state = {
      previewVisible: false, //标识 是否显示大图预览Modal
      previewImage: '', //大图的url
      previewTitle: '', //大图的标题
      fileList //所有已上传图片的数组(可能有 可能没有)
    }
  }

  //获取所有已上传图片文件名的数组
  getImgs = ()=>{
    return this.state.fileList.map(file => file.name)
  }
  //隐藏Modal(关闭大图预览)
  handleCancel = () => this.setState({ previewVisible: false });
  //显示Modal(打开指定file对应的大图预览)
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  //file:当前操作的图片文件(上传/删除)
  //fileList:所有已上传图片文件对象的[数组]
  handleChange = async ({ file,fileList }) => {
    console.log(file===fileList[fileList.length-1]); //false(file和fileList最后一张图 内容完全一致 但不全等)
    console.log(file.status, file);
    //如果上传成功 则将当前上传的file对应的信息进行修正(name,url)
    if(file.status==='done'){
      const result = file.response //{status:0, data:{name:'xxx.jpg', url:'图片地址'}
      if(result.status===0){
        message.success('上传图片成功！')
        const {name,url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      }else{
        message.error('上传图片失败')
      }
    }else if(file.status==='removed'){ //删除图片
      const result = await reqDeleteImg(file.name)
      if(result.status===0){
        message.success('删除图片成功！')
      }else{
        message.error('删除图片失败！')
      }
    }
    //在操作过程中(上传/删除) 更新fileList的状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传图片</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload" //上传图片的接口地址
          accept='image/*' //只接收图片格式
          name={UPLOAD_IMG_NAME}
          listType="picture-card" //卡片样式
          fileList={fileList} //所有已上传图片文件对象的[数组]
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {/* {fileList.length >= 8 ? null : uploadButton} */}
          {uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

//子组件调用父组件的方法：
//将父组件的方法以[函数属性]的形式传递给子组件 子组件就可以调用
//父组件调用子组件的方法：
//在父组件中 通过[ref]得到子组件标签对象(也就是组件对象) 调用其方法