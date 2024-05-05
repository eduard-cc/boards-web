import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type ProjectContextType = {
  update: boolean;
  setUpdate: Dispatch<SetStateAction<boolean>>;
};

const ProjectListContext = createContext<ProjectContextType | undefined>(
  undefined,
);

type ProjectProviderProps = {
  children: ReactNode;
};

export const ProjectListProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [update, setUpdate] = useState(false);

  const contextValue: ProjectContextType = {
    update,
    setUpdate,
  };

  return (
    <ProjectListContext.Provider value={contextValue}>
      {children}
    </ProjectListContext.Provider>
  );
};

export const useProjectListContext = () => {
  const context = useContext(ProjectListContext);
  if (!context) {
    return {
      update: false,
      setUpdate: () => {},
    };
  }
  return context;
};
