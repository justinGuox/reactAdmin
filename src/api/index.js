/*
要求: 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求: 能根据接口文档定义接口请求函数
 */
import ajax from './ajax'
// import jsonp from 'jsonp'
// import {message} from "antd";

// 登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

// // 通过jsonp获取当前天气信息
// export const reqWeather = (city) => {
//     const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
//     return new Promise((resolve, reject) => {
//         jsonp(url, {}, (err, response) => {
//             if (!err && response.status === 'success') {
//                 const {dayPictureUrl, weather} = response.results[0].weather_data[0]
//                 resolve({dayPictureUrl, weather})
//             } else {
//                 message.error('获取天气信息失败')
//             }
//         })
//     })
// }

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = ({categoryName, parentId}) => ajax('/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {
    categoryId,
    categoryName
}, 'POST')

// 获取商品分类列表
export const reqProducts = ({pageNum, pageSize}) => ajax('/manage/product/list', {pageNum, pageSize})

// 根据ID/Name搜索产品分页列表
///manage/product/search?pageNum=1&pageSize=5&productName=T
// searchType : 搜索的类型，productName/productDesc
// export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('manage/product/search', {
//     pageNum,
//     pageSize,
//     [searchType]: searchName,
// })
/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
})

// 根据分类ID获取分类/manage/category/info
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

// 对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')

// 删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

// 添加商品
export const reqAddProduct = (product) => ajax('/manage/product/add', product, 'POST')

// 更新商品
export const reqUpdateProduct = (product) => ajax('/manage/product/update', product, 'POST')

// 二合一版
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 获取所有角色列表
export const reqRoles = () => ajax('/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add',{roleName},'POST')

// 更新角色
export const reqUpdateRole = (role) => ajax('/manage/role/update',role,'POST')

// 获取用户列表
export const reqGetUsers = () => ajax('/manage/user/list')
// 添加/更新用户
export const reqAddOrUpdateUser =(user) => ajax('/manage/user/'+(user._id? 'update':'add'),user,'POST')
// 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')
