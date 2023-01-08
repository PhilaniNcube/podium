import { Fragment } from "react";
import Dashboard from "../../components/Dashboard";
import Stats from "../../components/Dashboard/Stats";



const index = () => {
  return <Fragment>
    <Dashboard>
      <Stats />
    </Dashboard>
  </Fragment>;
};
export default index;
