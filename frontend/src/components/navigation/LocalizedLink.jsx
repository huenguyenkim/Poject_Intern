import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { localizePath } from '../../utils/navigationUtils';

/**
 * A wrapper around react-router-dom Link that automatically
 * prefixes the to path with the current language code.
 */
const LocalizedLink = ({ to, children, ...props }) => {
  const { lang } = useParams();
  const localizedTo = localizePath(to, lang);

  return (
    <Link to={localizedTo} {...props}>
      {children}
    </Link>
  );
};

export default LocalizedLink;
