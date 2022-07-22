import React, { useState } from 'react';

type Props = {
  id: string;
  name: string;
  value: string;
}

export const FieldsPanelDisplayRow: React.FC<Props> = ({id, name, value}) => {
  const [editingText, setEditingText] = useState<boolean>(false);
  const [localName, setLocalName] = useState<string>(name);

  return null;
};
