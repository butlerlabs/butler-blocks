import { DocumentLabelerOutputDataDto } from 'common/types/DocumentLabelerTypes';
import React from 'react';

const SAVE = 'Save';

export type BBConfigurations = {
  displayOnly?: boolean;
  hideSaveButton?: boolean;
  saveActionButtonText?: string;
  fieldDisplayNameFormatter?: (fieldName: string) => string;
  onLabelUpdate?: (docInfo: DocumentLabelerOutputDataDto) => void;
  onSaveCallback: (data: DocumentLabelerOutputDataDto) => void;
  showToolbar?: boolean; // default = false
  toolbarProps?: {
    showPdf?: boolean;
    onToggleShowPdf?: (nextValue: boolean) => void;
    zoomMaxScale?: number;
    zoomMinScale?: number;
  };
};

type Props = {
  config: BBConfigurations;
};

const ConfigurationContext = React.createContext<BBConfigurations | null>(null);

/**
 * Provider used to share the configuration object to it's children (Document Labeler)
 * @returns
 */
export const BBConfigurationProvider: React.FC<Props> = ({
  children,
  config,
}) => {
  return (
    <ConfigurationContext.Provider
      value={{
        ...config,
        saveActionButtonText: config?.saveActionButtonText || SAVE,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useBBConfiguration = () => {
  const context = React.useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      'useBBConfiguration must be used within a BBConfigurationProvider',
    );
  }
  return context;
};
