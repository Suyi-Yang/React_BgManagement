/* redux最核心的管理对象 store */
import { createStore,applyMiddleware } from "redux";
import thunk from "redux-thunk"; //实现redux中的异步任务
import { composeWithDevTools } from "redux-devtools-extension";

import reducer from './reducer'

//向外默认暴露store
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))