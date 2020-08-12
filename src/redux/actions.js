import {
    ADD_CATEGORY,
    ADD_TWO_CATEGORY,
    AUTH_SUCCESS,
    GET_ONE_CATEGORYS,
    GET_TWO_CATEGORYS,
    OUT_SUCCESS,
    GET_PRODUCTS,
    SAVE_PRODUCTS_INFO,
    SAVE_PRODUCTS_INFO2,
    GET_ROLES,
    ADD_ROLE
} from './action-types'
import {reqAddCategory, reqCategorys, reqLogin, reqUpdateCategory,reqProducts,reqSearchProducts,reqCategory,reqUpdateStatus,reqAddOrUpdateProduct,reqRoles,reqAddRole,reqUpdateRole} from "../api";
import {message} from "antd";
import storageUtils from "../utils/storageUtils";
import Utils from "../utils/storageUtils";

// 登录成功同步action
const receivelogin = (user) => ({type: AUTH_SUCCESS, user})
export const loginOut = () => ({type: OUT_SUCCESS})
const receiveOneCategory = (categorys) => ({type: GET_ONE_CATEGORYS, categorys})
const receiveTwoCategory = (categorys) => ({type: GET_TWO_CATEGORYS, categorys})
const receiveAddCategory = (category) => ({type: ADD_CATEGORY, category})
const receiveAddTwoCategory = (category) => ({type: ADD_TWO_CATEGORY, category})
// 修改分类名称
export const UpdateCategory = ({categoryId, categoryName}) => {
    return async dispatch => {
        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status === 0) {
            message.success('修改成功')
        } else {
            message.error('修改分类名称失败')
        }
    }
}
const receiveProducts = (products) => ({type: GET_PRODUCTS, products})
//const receiveSearchProducts = (list) => ({type: SEARCHPRODUCTS, list})
const receivedSaveCategory1 = (categoryInfo) => ({type: SAVE_PRODUCTS_INFO,categoryInfo})
const receivedSaveCategory2 = (categoryInfo) => ({type: SAVE_PRODUCTS_INFO2,categoryInfo})
// 对商品进行上架/下架处理
export const receiveUpdateStatus = (productId, status) => {
    return async dispatch => {
        const result = await reqUpdateStatus(productId, status)
        const msg = status===1 ? '下架' : '上架'
        if (result.status === 0) {
            message.success('商品' + msg + '成功')
        } else {
            message.error('商品' + msg + '失败')
        }
    }
}
const receiveGetRoles = (roles) => ({type:GET_ROLES,roles})
const receiveAddRole = (role) => ({type:ADD_ROLE,role})

// 获取所有角色列表
export const getRoles = () => {
    return async dispatch => {
        const result = await reqRoles()
        if (result.status === 0) {
            dispatch(receiveGetRoles(result.data))
        } else {
            message.error('获取角色列表失败')
        }
    }
}
export const updateRole = (role, props) => {
    return async dispatch => {
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            // 如果更新的是自己的角色权限，则强制退出
            const role_id = Utils.getUser().role_id
            if (role._id === role_id) {
                Utils.removeUser()
                dispatch(loginOut())
                props.history.replace('/login')
                message.info('当前用户角色权限已修改，请重新登录')
            } else {
                message.success('更新角色权限成功')
            }
        } else {
            message.error('更新角色权限失败')
        }
    }
}

export const addRole = (roleName) => {
    return async dispatch => {
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
            dispatch(receiveAddRole(result.data))
        } else {
            message.error(result.msg)
        }
    }
}

// 添加、修改商品
export const addOrUpdateProduct = (product, props) => {
    return async dispatch => {
        const result = await reqAddOrUpdateProduct(product)
        const _id = product._id
        if (result.status === 0) {
            message.success(_id?'更新商品成功':'添加商品成功')
            props.history.goBack()
        } else {
            message.error(_id?'更新商品失败':'添加商品失败')
        }
    }
}

// 根据分类ID获取分类名称
export const getCategoryInfo = ({pCategoryId, categoryId}) => {
    return async dispatch => {
        if (pCategoryId === '0') { // 一级分类下的商品
            /* 返回结果
            {
                "parentId": "0",
                "_id": "5c2ed631f352726338607046",
                "name": "分类001",
                "__v": 0
             }
            */
            const result = await reqCategory(categoryId)
            if (result.status === 0) {
                dispatch(receivedSaveCategory1(result.data))
            } else {
                message.error(result.msg)
            }
            // dispatch(receivedSaveCategory(result.data))
            // const cName1 = result.data.name
            // this.setState({cName1})
        } else { // 二级分类下的商品
            // console.log('父级ID:'+pCategoryId+'自身ID：'+categoryId)
            // 一次性发送多个请求, 只有都成功了, 才正常处理
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            // console.log(results)
            results.forEach(result => dispatch(receivedSaveCategory2(result.data)))
            //dispatch(receivedSaveCategory2(results.data))
            // const cName1 = results[0].data.name
            // const cName2 = results[1].data.name
            // this.setState({
            //     cName1,
            //     cName2
            // })
        }
    }
}

// 获取商品分类列表
export const getProducts = (pageNum, pageSize) => {
    return async dispatch => {
        const result = await reqProducts({pageNum, pageSize})
        if (result.status === 0) {
            dispatch(receiveProducts(result.data))
        } else {
            message.error('获取商品分类列表失败')
        }
    }
}
// 根据ID/Name搜索产品分页列表reqSearchProducts
export const getSearchProducts = ({pageNum, pageSize, searchName, searchType}) => {
    return async dispatch => {
        const result = await reqSearchProducts({pageNum, pageSize, searchName, searchType})
        if (result.status === 0) {
            dispatch(receiveProducts(result.data))
        } else {
            message.error('搜索商品分类列表失败')
        }
    }
}



// 登陆异步action
export const login = (username, password) => {
    return async dispatch => {
        const result = await reqLogin(username, password)
        if (result.status === 0) {
            message.success('登陆成功')
            const user = result.data
            storageUtils.saveUser(user)
            dispatch(receivelogin(user))
        } else {
            message.error(result.msg)
        }
    }
}

// 获取分类列表
export const getCategory = (parentId) => {
    return async dispatch => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            // 取出分类数组(可能是一级也可能二级的)
            // message.success('添加商品分类成功')
            if (parentId === '0') {
                dispatch(receiveOneCategory(result.data))
            } else {
                dispatch(receiveTwoCategory(result.data))
            }

        } else {
            message.error('获取分类列表失败')
        }
    }
}

// 添加商品分类
export const addCategory = ({categoryName, parentId}) => {
    return async dispatch => {
        const result = await reqAddCategory({categoryName, parentId})
        if (result.status === 0) {
            message.success('添加商品分类成功')
            // 取出分类数组(可能是一级也可能二级的)
            if (parentId === '0') {
                dispatch(receiveAddCategory(result.data))
            } else {
                dispatch(receiveAddTwoCategory(result.data))
            }
        } else {
            message.error('添加分类失败')
        }
    }
}
