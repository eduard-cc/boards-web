import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import type { Project } from "@/types/project";
import type { Member } from "@/types/member";

type ProjectContextType = {
  projectData: Project | null;
  setProjectData: Dispatch<SetStateAction<Project | null>>;
  update: boolean;
  setUpdate: Dispatch<SetStateAction<boolean>>;
  currentMember: Member | null;
  setCurrentMember: Dispatch<SetStateAction<Member | null>>;
  memberCount: number | null;
  setMemberCount: Dispatch<SetStateAction<number | null>>;
  issueCount: number | null;
  setIssueCount: Dispatch<SetStateAction<number | null>>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

type ProjectProviderProps = {
  children: ReactNode;
};

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [update, setUpdate] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [issueCount, setIssueCount] = useState<number | null>(null);

  const contextValue: ProjectContextType = {
    projectData,
    setProjectData,
    update,
    setUpdate,
    currentMember,
    setCurrentMember,
    memberCount,
    setMemberCount,
    issueCount,
    setIssueCount,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    return {
      projectData: null,
      setProjectData: () => {},
      update: false,
      setUpdate: () => {},
      currentMember: null,
      setCurrentMember: () => {},
      memberCount: null,
      setMemberCount: () => {},
      issueCount: null,
      setIssueCount: () => {},
    };
  }
  return context;
};
