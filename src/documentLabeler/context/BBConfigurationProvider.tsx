import { DocumentLabelerOutputDataDto } from "common/types/DocumentLabelerTypes";
import React from "react";

const SAVE = "Save";

export type BBConfigurations = {
  displayOnly?: boolean;
  hideSaveButton?: boolean;
  saveActionButtonText?: string;
  fieldsNameFormatter?: (fieldName: string) => string;
	onSaveCallback: (data: DocumentLabelerOutputDataDto) => void
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
      value={{ ...config, saveActionButtonText: config?.saveActionButtonText || SAVE }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useBBConfiguration = () => {
  const context = React.useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      "useBBConfiguration must be used within a BBConfigurationProvider"
    );
  }
  return context;
};
