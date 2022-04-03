
  let wipRoot=null;
  function render(vnode, container) {
    wipRoot = {
      type:'div',
      props:{children: {...vnode}},
      stateNode: container,
    }
    nextUnitOfWork = wipRoot;

  }
  
  function createNode(workInProgress){  
    let node;
    const {type,props} = workInProgress;
    node = document.createElement(type);

    updataNode(node, props);

    // 因为 函数组件和类组件没dom节点
  
  //   if (typeof type === 'string'){
  //     node = updateHostComponent(vnode);
  //   }else if (typeof type === 'function'){
  // console.log('type.prototype.isReactComponent==',type.prototype.isReactComponent, type.aaaaaa);
  
  //     node = type.prototype.isReactComponent ? updataClassComponent(vnode) : updataFunctionComponent(vnode);
  //   } else {
  //     node = updateTextComponent(vnode);
  
  //   }
    return node;
  }

  function isStringOrNumber(sth) { return typeof sth === "string" || typeof sth === "number"; }

  function updataNode(node, props) { 
    Object.keys(props).forEach(k => { 
      if (k === "children") { 
        if (isStringOrNumber(props[k])) { //文本节点作为属性加入dom
          node.textContent = props[k]; 
        } 
      } else { 
        node[k] = props[k]; 
      } 
    }); 
  }
  

  // 原生标签和类组件一样都有子节点
  function updateHostComponent(workInProgress){

    if(!workInProgress.stateNode) {
      workInProgress.stateNode = createNode(workInProgress);
    }
    // 协调子节点
    reconcileChildren(workInProgress,workInProgress.props.children);

    console.log('work==',workInProgress);
  }
  // 类组件
  function updataClassComponent(workInProgress){
    console.log('updataClassComponent===', workInProgress)
    const {type,props} = workInProgress;  
    const instance = new type(props);
    const child = instance.render();
    console.log('child==', child)
    reconcileChildren(workInProgress,child);
  }
  // 函数组件
  function updataFunctionComponent(workInProgress){
    const {type,props} = workInProgress;
    const child = type(props);
    reconcileChildren(workInProgress,child);
  }
  // FragementComponent
  function updataFragmentComponent(workInProgress){
    reconcileChildren(workInProgress, workInProgress.props.children)
  }
  //文本标签   已作为属性加入dom
  // // 文本节点 
  // function updateTextComponent(vnode) { 
  //   const node = document.createTextNode(vnode); 
  //   return node; 
  // }
  
  function reconcileChildren(workInProgress, children){

    if (isStringOrNumber(children)) {
      return;
    }
    const newChildren = Array.isArray(children) ? children : [children];

    let preNewFible = null;
    for(let i=0; i<newChildren.length;i++){
      let child = newChildren[i];
      let newFible = {
        type: child.type,
        props: {...child.props},
        stateNode: null,
        child: null,
        sibling: null,
        return: workInProgress,
      }
      if (i===0) {
        workInProgress.child = newFible;
      }else{
        preNewFible.sibling = newFible;
      }

      preNewFible = newFible;
    }
    
  }
  
  export class Component {  
    static aaaaaa = 'aaaa';
    constructor(props) {
      console.log('props==', props);
      this.props = props;
    }  
  }
  
  Component.prototype.isReactComponent= true

// 下一个待执行的任务
let nextUnitOfWork = null;
// workInProgress work in progess 当前正在执行的fiber；
function performUnitOfWork(workInProgress) {

  // 1.更新当前任务
  const {type} = workInProgress;
  if (typeof type==='string'){
    updateHostComponent(workInProgress);
  } else if(typeof type === 'function'){
    type.prototype.isReactComponent ? updataClassComponent(workInProgress) : updataFunctionComponent(workInProgress);
  } else {
    updataFragmentComponent(workInProgress);
  }
  
  // 2.返回下一个待更新任务
  // 深度优先遍历（王朝的故事）
  // while(workInProgress && workInProgress.child){
  //   if (!workInProgress.sibling) {
  //     nextUnitOfWork = workInProgress.child;
  //   } else {

  //   }
  // }

  if (workInProgress.child){
    return workInProgress.child
  }
  let nextFible = workInProgress;
  while(nextFible) {

    if (nextFible.sibling){
      return nextFible.sibling
    }else{
      nextFible=nextFible.return;
    }

  }
  
}

  function workLoop(IdleDeadline){
      //更新链表 再更新到dom

    while(nextUnitOfWork && IdleDeadline.timeRemaining()>1){      
     nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    // commt提交
    if(!nextUnitOfWork && wipRoot){
      commitRoot();
    }

    requestIdleCallback(workLoop);

  }

  requestIdleCallback(workLoop);


  function commitRoot() {
    commitRootWork(wipRoot.child);
    wipRoot = null;
  }

  function commitRootWork(workInProgress) {
    if(!workInProgress){ //下面有递归；
      return;
    }

    // 1.提交自己
    let parentFiber = workInProgress.return;
    while(!parentFiber.stateNode){
      parentFiber = parentFiber.return;
    }

    let parentNode = parentFiber.stateNode;

    if (workInProgress.stateNode){
      parentNode.appendChild(workInProgress.stateNode);
    }
    // 2.提交子节点
    commitRootWork(workInProgress.child);
    // 3.提交兄弟节点
    commitRootWork(workInProgress.sibling);
  }



  export default {render}