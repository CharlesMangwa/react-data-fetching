/* @flow */

import React from "react";
import { PropTypes } from "prop-types";

import type { Context } from "../../types";

const getElementWithContent = (
  context: Context,
  children: Class<*>
): React$Element<*> => {
  class Element extends React.Component<*> {
    static childContextTypes = Object.keys(context).reduce((obj, key) => {
      obj[key] = PropTypes.any;
      return obj;
    }, {});

    getChildContext = () => context;

    render() {
      return children;
    }
  }

  return React.createElement(Element, { ...children.props });
};

export default getElementWithContent;
