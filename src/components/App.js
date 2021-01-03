import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Home from './pages/Home';
import Add from './pages/Add';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/add" component={Add} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
