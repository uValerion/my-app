import './App.css';
import UsersBlade from './Users/UsersBlade';

const companyIdMock = ["comp_001", "comp_002", "comp_003"];

function App() {
  return (
    <div >
        <UsersBlade companyId={companyIdMock[0]} />
    </div>
  );
}

export default App;
