import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM, {Component} from './my-react-dom';
import './index.css';


function FunctionComponent(props){
  
  return <div>
      <p>{props.name}</p>
  </div>
}

class ClassComponent extends Component {
  render(){
    return <div>
      <p>{this.props.name}</p>
    </div>
  }
}

const jsx = <div className='border'>
  <h1>aaa</h1>
  <a href="www.taobao.com">taobo</a>
  <FunctionComponent name='函数组件'/>
  <ClassComponent name= '类组件'/>
  <>
    <span>fragement</span>
  </>
</div>

ReactDOM.render(jsx,
  document.getElementById('root')
);
