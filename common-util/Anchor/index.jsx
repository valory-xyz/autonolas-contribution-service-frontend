import PropTypes from 'prop-types';

/**
 * component to render <a> tag
 */
export const Anchor = ({
  hasSpacePrefix,
  hasSpaceSuffix,
  url,
  text,
  className,
  ...rest
}) => (
  <>
    {hasSpacePrefix && <>&nbsp;</>}
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...rest}
    >
      {text}
    </a>
    {hasSpaceSuffix && <>&nbsp;</>}
  </>
);

Anchor.propTypes = {
  hasSpacePrefix: PropTypes.bool,
  hasSpaceSuffix: PropTypes.bool,
  url: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

Anchor.defaultProps = {
  hasSpacePrefix: true,
  hasSpaceSuffix: false,
  url: null,
  text: null,
  className: null,
};

export const AB = null;
