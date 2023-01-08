import Link from 'next/link';
import { Fragment } from 'react';
import Banner from './Banner';
import styles from './Header.module.css';
import Navigation from './Navigation';
import Top from './Top';

const Header = () => {
  return (
    <Fragment>
     <Banner />
     <Top />
     <Navigation />
    </Fragment>
  );
};
export default Header;
