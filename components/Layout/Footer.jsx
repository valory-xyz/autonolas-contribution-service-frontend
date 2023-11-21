import { Footer as CommonFooter } from '@autonolas/frontend-library';
import { Typography } from 'antd';
import Socials from './Socials';

const { Link } = Typography;

const Footer = () => (
  <CommonFooter
    centerContent={(
      <>
        <div className="mb-12">
          ©&nbsp;Autonolas DAO&nbsp;
          {new Date().getFullYear()}
          &nbsp;•&nbsp;
          <Link type="secondary" href="/disclaimer">Disclaimer</Link>
          &nbsp;•&nbsp;
          <Link
            type="secondary"
            href="https://gateway.autonolas.tech/ipfs/bafybeibrhz6hnxsxcbv7dkzerq4chssotexb276pidzwclbytzj7m4t47u"
            target="_blank"
            rel="noopener noreferrer"
          >
            DAO Constitution ↗
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Socials />
        </div>
      </>
    )}
  />
);

export default Footer;
