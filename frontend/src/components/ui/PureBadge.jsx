import React from 'react';
import Badge from './Badge';

/**
 * Demonstrates: Pure Component (React.memo)
 * 
 * Component này chỉ Render lại (Re-render) khi và chỉ khi Props truyền vào thực sự thay đổi.
 * Tương đương với React.PureComponent của Class Component. Tránh render phung phí.
 */
const PureBadge = React.memo(({ children, variant, className }) => {
  // Bọc Component Badge có sẵn vào React.memo
  return (
    <Badge variant={variant} className={className}>
      {children}
    </Badge>
  );
});

PureBadge.displayName = 'PureBadge';

export default PureBadge;
