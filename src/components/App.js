import {HashRouter,BrowserRouter,Route,Switch} from 'react-router-dom';
import Home from './pages/Home';
import Add from './pages/Add';

function App() {

  const getRoutes = ()=>{
    return(
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/add" component={Add} />
      </Switch>
    );
  }

  if(process.env.NODE_ENV==='production'){
    return (
      <HashRouter>
        {getRoutes()}
      </HashRouter>
    );
  }else{
    return (
      <BrowserRouter>
        {getRoutes()}
      </BrowserRouter>
    );
  }
}

export default App;
