import Link from 'next/link';
import { Footer as CommonFooter } from '@autonolas/frontend-library';
import Socials from './Socials';

const Footer = () => (
  <CommonFooter
    rightContent={(
      <>
        <br />
        <br />
        <br />
        <Socials />
      </>
    )}
    centerContent={(
      <>
        ©&nbsp;Autonolas DAO&nbsp;
        {new Date().getFullYear()}
        &nbsp;•&nbsp;
        <Link href="/disclaimer">Disclaimer</Link>
      </>
    )}
  />
);

export default Footer;
