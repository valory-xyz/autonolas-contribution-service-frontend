import Link from 'next/link';
import { Footer as CommonFooter } from '@autonolas/frontend-library';

const Footer = () => (
  <CommonFooter
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
