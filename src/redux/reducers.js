/*
包含n个reducer函数: 根据老的state和指定的action返回一个新的state
 */
import {combineReducers} from "redux";
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
import storageUtils from "../utils/storageUtils";

const initUser = storageUtils.getUser()

function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            return action.user
        case OUT_SUCCESS:
            return {}
        default:
            return state
    }
}

// 初始化品类列表
const initCategorys = []

function categorys(state = initCategorys, action) {
    switch (action.type) {
        case GET_ONE_CATEGORYS:
            return action.categorys
        case ADD_CATEGORY:
            return [...state, action.category]
        default:
            return state
    }
}
const TwoCategorys = []
function twoCategorys(state = TwoCategorys, action) {
    switch (action.type) {
        case GET_TWO_CATEGORYS:
            return action.categorys
        case ADD_TWO_CATEGORY:
            return [...state, action.category]
        default:
            return state
    }
}

// 初始化商品列表
const products = {}
function getProducts(state = products, action) {
    switch (action.type) {
        case GET_PRODUCTS:
            return action.products
        // case SEARCHPRODUCTS:
        //     return {...state, list:action.list}
        default:
            return state
    }
}
const products_info = []
function productsInfo(state=products_info, action) {
    switch (action.type) {
        case SAVE_PRODUCTS_INFO:
            return [action.categoryInfo]
        case SAVE_PRODUCTS_INFO2:
            return [...state, action.categoryInfo]
        default:
            return state
    }
}

let roles = []
// 初始化角色列表
function initRoles(state=roles, action) {
    switch (action.type) {
        case GET_ROLES:
            return [action.roles]
        case ADD_ROLE:
            roles = [...state]
            roles[0].push(action.role)
            return roles
        default:
            return state
    }
}

export default combineReducers({
    user,
    categorys,
    twoCategorys,
    getProducts,
    productsInfo,
    initRoles
})
