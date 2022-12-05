import { Button } from 'antd/lib';
import PropTypes from 'prop-types';
import { COLOR } from 'util/theme';

export const commonStyle = {
  color: COLOR.WHITE,
  padding: '6px 32px',
};

/**
 * @returns RedButton component
 */

const getStyle = (k) => {
  switch (k) {
    case 'transparent':
      return {
        color: COLOR.BLACK,
        borderColor: COLOR.GREY_1,
        backgroundColor: 'transparent',
      };

    case 'purple':
      return {
        color: COLOR.WHITE,
        borderColor: COLOR.PRIMARY,
        backgroundColor: COLOR.PRIMARY,
      };

    case 'green':
      return {
        color: COLOR.BLACK,
        borderColor: COLOR.SECONDARY,
        backgroundColor: COLOR.SECONDARY,
      };

    case 'disabled':
      return {
        color: COLOR.GREY_1,
        borderColor: COLOR.BORDER_GREY,
        backgroundColor: COLOR.BORDER_GREY,
      };

    default:
      return {};
  }
};

export const CustomButton = ({
  children, variant, style, ...rest
}) => (
  <Button
    {...rest}
    style={{ ...commonStyle, ...getStyle(variant), ...(style || {}) }}
  >
    {children}
  </Button>
);

CustomButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array, PropTypes.string]),
  variant: PropTypes.string,
  style: PropTypes.shape({}),
};

CustomButton.defaultProps = {
  children: null,
  variant: null,
  style: {},
};

export default CustomButton;

//
