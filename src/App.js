import './CSS/App.scss';
import { withRouter } from 'react-router-dom';
import AppFunction from './functions/AppFunction';
import StoreRoutes from './components/StoreRoutes';
import Header from './components/Header';

function App({ history, location }) {
  const {
    logoutUser,
    loaderDisplay,
    setLoaderDisplay,
    staffName,
    staffUserName,
    showBill,
    value,
    setValue,
  } = AppFunction(history, location);

  const devBg = process.env.NODE_ENV !== 'production' ? 'indianred' : 'none';
  return (
    <div className="App" style={{ backgroundColor: devBg }}>
      {staffUserName && (
        <Header
          staffName={staffName}
          staffUserName={staffUserName}
          showBill={showBill}
          setValue={setValue}
          value={value}
          logoutUser={logoutUser}
        />
      )}
      <StoreRoutes
        setLoaderDisplay={setLoaderDisplay}
        loaderDisplay={loaderDisplay}
        style={{ marginLeft: '100px' }}
      />

      {/* <QRComp /> */}
    </div>
  );
}

export default withRouter(App);
