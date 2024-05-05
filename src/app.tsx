import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { UserProvider } from "@/providers/user-provider";
import UserNavbar from "@/components/user-navbar/user-navbar";
import HomePage from "@/pages/home-page";
import LoginPage from "@/pages/login-page";
import SignupPage from "@/pages/signup-page";
import ProfilePage from "@/pages/profile-page";
import EmailPage from "@/pages/email-page";
import SecurityPage from "@/pages/security-page";
import CreateProjectPage from "@/pages/create-project-page";
import ViewProjectsPage from "@/pages/view-projects-page";
import ProjectIssueListPage from "@/pages/project-issue-list-page";
import ProjectIssueBoardPage from "@/pages/project-issue-board-page";
import ProjectSettingsPage from "@/pages/project-settings-page";
import ProjectLayout from "@/components/project/project-layout";
import { ProjectProvider } from "@/providers/project-provider";
import ProjectMembersPage from "@/pages/project-members-page";
import ViewUsersPage from "@/pages/view-users-page";
import RouteGuard from "@/components/route-guard";
import { Toaster } from "@/components/ui/toaster";
import { ProjectListProvider } from "@/providers/project-list-provider";
import NotFoundPage from "@/pages/not-found-page";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";

function AuthAwareUserNavbar() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <UserNavbar /> : null;
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <UserProvider>
          <Router>
            <AuthAwareUserNavbar />
            <Routes>
              <Route path="*" element={<NotFoundPage />} />
              <Route
                path="/"
                element={
                  <RouteGuard>
                    <HomePage />
                  </RouteGuard>
                }
              />
              <Route
                path="/login"
                element={
                  <RouteGuard>
                    <LoginPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/signup"
                element={
                  <RouteGuard>
                    <SignupPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/terms"
                element={
                  <RouteGuard>
                    <TermsOfService />
                  </RouteGuard>
                }
              />
              <Route
                path="/privacy"
                element={
                  <RouteGuard>
                    <PrivacyPolicy />
                  </RouteGuard>
                }
              />
              <Route
                path="/users"
                element={
                  <RouteGuard protectedRoute>
                    <ViewUsersPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <RouteGuard protectedRoute>
                    <ProfilePage />
                  </RouteGuard>
                }
              />
              <Route
                path="/profile/email"
                element={
                  <RouteGuard protectedRoute>
                    <EmailPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/profile/security"
                element={
                  <RouteGuard protectedRoute>
                    <SecurityPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/create-project"
                element={
                  <RouteGuard protectedRoute>
                    <CreateProjectPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/projects"
                element={
                  <RouteGuard protectedRoute>
                    <ProjectListProvider>
                      <ViewProjectsPage />
                    </ProjectListProvider>
                  </RouteGuard>
                }
              />
              <Route
                path="/projects/:id/*"
                element={
                  <RouteGuard protectedRoute>
                    <ProjectProvider>
                      <ProjectLayout>
                        <Routes>
                          <Route
                            path="/list"
                            element={<ProjectIssueListPage />}
                          />
                          <Route
                            path="/board"
                            element={<ProjectIssueBoardPage />}
                          />
                          <Route
                            path="/settings"
                            element={<ProjectSettingsPage />}
                          />
                          <Route
                            path="/members"
                            element={<ProjectMembersPage />}
                          />
                          <Route path="*" element={<Navigate to="list" />} />
                        </Routes>
                      </ProjectLayout>
                    </ProjectProvider>
                  </RouteGuard>
                }
              />
            </Routes>
            <Toaster />
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
