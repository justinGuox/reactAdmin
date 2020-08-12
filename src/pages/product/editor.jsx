import React from 'react';
import Edi from 'wangeditor'
import {message} from 'antd'
// 这css里面记得导入相关的antd CSS，若不使用antd也可，只是一个效果
// import './css/post.css'
import {baseUrl} from "../../api/ajax";
// 我的照片上传API
const reqUrl = baseUrl+'/manage/img/upload'

let editor1;

export default class Editor extends React.Component {
    componentDidMount() {
        this.initEditor()
    }

    initEditor() {
        const elem = this.refs.editor
        const editor = new Edi(elem)
        editor1 = editor

        editor1.customConfig.zIndex = 100
        editor1.customConfig.uploadImgServer = reqUrl
        // 限制一次最多上传 1 张图片
        editor1.customConfig.uploadImgMaxLength = 1
        editor1.customConfig.customUploadImg = function (files, insert) {
            // files 是 input 中选中的文件列表
            // console.log(files)
            if (files[0]) {
                const formData = new window.FormData()
                formData.append('image', files[0], 'cover.jpg')
                fetch(reqUrl, {
                    method: 'POST',
                    contentType: false,
                    body: formData
                }).then((res) => {
                    return res.json()
                }).then((res) => {
                    // console.log(res)
                    if (res.status === 0) {
                        // 这里你的后台可能不是我这样的对象属性，后面会带我的node后台，请自行参考
                        insert(res.data.url)
                    } else {
                        message.error('图片添加失败')
                    }
                })
            } else {
                message.info('请选择想上传的图片')
            }
        }
        // 自定义配置颜色（字体颜色、背景色）
        editor.customConfig.colors = [
            '#000000',
            '#0000ff',
            '#800000',
            '#ff0000',
            '#f47920',
            '#ea66a6',
            '#afdfe4',
            '#563624',
            '#3e4145',
            '#90d7ec',
            '#ffffff'
        ];

        editor1.customConfig.menus = [
            'head', // 标题
            'bold', // 粗体
            'fontSize', // 字号
            'fontName', // 字体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            'quote', // 引用
            'emoticon', // 表情
            'image', // 插入图片
            // 'table', // 表格
            // 'video', // 插入视频
            // 'code', // 插入代码
            'undo', // 撤销
            'redo' // 重复
        ]
        editor1.customConfig.lang = {
            '设置标题': 'Title',
            '字号': 'Size',
            '文字颜色': 'Color',
            '设置列表': 'List',
            '有序列表': '',
            '无序列表': '',
            '对齐方式': 'Align',
            '靠左': '',
            '居中': '',
            '靠右': '',
            '正文': 'p',
            '链接文字': 'link text',
            '链接': 'link',
            '上传图片': 'Upload',
            '网络图片': 'Web',
            '图片link': 'image url',
            '插入视频': 'Video',
            '格式如': 'format',
            '上传': 'Upload',
            '创建': 'init'
        }
        editor1.create()
        let detail = this.props.detail
        if (detail) {
            editor1.txt.html(detail)
        }

    }

    getEditor = () => {
        return editor1.txt.html()
    }

    render() {
        return (
            <div>
                <div ref='editor' />
                {/*<Button onClick={this.post.bind(this)} type="primary">Primary</Button>*/}
            </div>
        );
    }
    // post() {
    //     let html = editor1.txt.html()        // 这里放你的上传文章代码，由于各人这边的逻辑都可能不一样，就不写上去了
    //     console.log(html);
    // }
}
