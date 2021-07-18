import { Redirect } from 'react-router-dom';
import Main from './Main';
import Background from '../../common/Background';


export default function Home(props) {
  const { authenticated, history, location } = props;

  if (authenticated) {
    return <Redirect
      to={{
        pathname: "/dashboard",
        state: { from: location }
      }}
    />;
  }
  return (
    <>
      <Main />
      <Background num={130} />
    </>
  );
}
