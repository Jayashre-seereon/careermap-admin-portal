import { createBrowserRouter, Navigate } from "react-router-dom";
import PermissionRoute from "./PermissionRoute";
import AdminOnly from "./AdminOnly";
import NotFoundPage from "./NotFoundPage";
import { useSessionStore } from "../store/sessionStore";
import DashboardPage from "../pages/DashboardPage";
import DashBoardlayout from "../components/layout/DashBoardlayout";
import MentorPage from "../features/mentor/MentorPage";
import AllUsers from "../features/allUser";
import AllUsersTab from "../features/allUser/tabs/AllUsers";
import Active from "../features/allUser/tabs/Active";
import Banned from "../features/allUser/tabs/Banned";
import EmailUnverified from "../features/allUser/tabs/EmailUnverified";
import MobileUnverified from "../features/allUser/tabs/MobileUnverified";
import Subscribers from "../features/Subscribers/Subscribers";
import WithBalance from "../features/allUser/tabs/WithBalance";
import NotificationToUser from "../features/allUser/tabs/NotificationToUser";
import UserDetails from "../features/allUser/tabs/UserDetails";
import ModulePage from "../features/modules/ModulePage";
import StreamPage from "../features/stream/StreamPage";
import CategoryPage from "../features/categories/CategoryPage";
import Category2Page from "../features/2ndcategories/Category2Page";
import SubCategoryPage from "../features/subcategories/SubCategoryPage";
import DetailsPage from "../features/details/DetailsPage";
import SalaryPage from "../features/salary/SalaryPage";
import JobScopePage from "../features/jobscope/JobScopePage";
import RequireAuth from "../features/auth/RequireAuth";
import PublicOnlyRoute from "../features/auth/PublicOnlyRoute";
import AuthLayout from "../features/auth/AuthLayout";
import LoginPage from "../features/auth/LoginPage";
import InstituteLoginPage from "../features/auth/InstituteLoginPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/ResetPasswordPage";
import RootRedirect from "../features/auth/RootRedirect";
import PathTypePage from "../features/pathtype/PathTypePage";
import CareerPathPage from "../features/careerpath/CareerPathPage";
import EntranceExamPage from "../features/entranceexam/EntranceExamPage";
import InstitutionPage from "../features/institution/InstitutionPage";
import ScholarshipPage from "../features/scholarship/ScholarshipPage";
import MasterClassPage from "../features/masterclass/MasterClassPage";
import StudyAbroadPage from "../features/studyabroad/StudyAbroadPage";
import CareerPlanPage from "../features/careerplan/CareerPlanPage";
import AllOrder from "../features/allOrders/AllOrder";
import ApprovedOrder from "../features/allOrders/ApprovedOrder";
import PendingOrder from "../features/allOrders/PendngOrder";
import SupportTickets from "../features/supportTickets/SupportTickets";
import AllTickets from "../features/supportTickets/AllTickets";
import PendingTickets from "../features/supportTickets/PendingTickets";
import ClosedTickets from "../features/supportTickets/ClosedTickets";
import AnsweredTickets from "../features/supportTickets/AnsweredTickets";
import TicketDetails from "../features/supportTickets/TicketDetails";
import BookingTable from "../features/bookings/BookingTable";
import PlansPage from "../features/plans/PlansPage";
import SubscriptionsPage from "../features/subscriptions/SubscriptionsPage";
import ServicesPage from "../features/services/ServicesPage";
import CountriesPage from "../features/allcountries/CountriesPage";
import StatesPage from "../features/states/StatesPage";
import DistrictsPage from "../features/districts/DistrictsPage";
import TransactionsPage from "../features/transactions/TransactionsPage";
import LoginActivitiesPage from "../features/loginactivities/LoginActivitiesPage";
import NotificationsPage from "../features/notifications/NotificationsPage";
import LogoFavicon from "../features/logo&favicon/LogoFavicon";
import AllTemplatesPage from "../features/email&notification/alltemplates/AllTemplatesPage";
import GlobalTemplatePage from "../features/email&notification/globaltemplates/GlobalTemplatePage";
import EmailConfigPage from "../features/email&notification/emailconfig/EmailConfigPage";
import SmsConfigPage from "../features/email&notification/smsconfig/SmsConfigPage";
import JobPage from "../features/jobs/JobPage";
import JobFormPage from "../features/jobs/JobFormPage";
import JobApplicationsPage from "../features/jobs/JobApplicationsPage";
import QuizPage from "../features/quiz/QuizPage";
import QuizQuestionsPage from "../features/quiz/QuizQuestionsPage";
import GlobalSettingsPage from "../features/globalsettings/GlobalSettingsPage";
import LanguagePage from "../features/language/LanguagePage";
import LanguageKeywordsPage from "../features/language/LanguageKeywordsPage";
import SeoPage from "../features/seo/SeoPage";
import SocialCredentialPage from "../features/socialcredential/SocialCredentialPage";
import ProfilePage from "../features/profile/ProfilePage";
import Domain from "../features/psychometric/Domain";
import Assessment from "../features/psychometric/Assessment";
import CareerPath from "../features/psychometric/CareerPath";
import CareerCategory from "../features/psychometric/CareerCategory";
import Institute from "../features/psychometric/Institute";
import Question from "../features/psychometric/Question";
import Section from "../features/psychometric/Section";
import AssessmentPage from "../features/psychometric/AssessmentPage";
import SectionPage from "../features/psychometric/SectionPage";
import QuestionBankPage from "../features/psychometric/QuestionBankPage";
import CareerClusterPage from "../features/psychometric/CareerClusterPage";
import StudentAttemptsPage from "../features/psychometric/StudentAttemptsPage";
import Student from "../features/psychometric/Student";
import AssessmentReportPage from "../features/psychometric/AssessmentReportPageLazy";
import PersonalityTest from "../features/personalityTest/PersonalityTest";
import Counseling from "../features/counseling/Counseling";
import Staff from "../features/staff/Staff";
import RolePage from "../features/role/RolePage";
import Permission from "../features/permission/Permission";
import InstituteLayout from "../components/institute/InstituteLayout";
import InstituteDashboardPage from "../pages/InstituteDashboardPage";
import InstituteStudentsPage from "../features/institute/InstituteStudentsPage";
import InstituteAttemptsPage from "../features/institute/InstituteAttemptsPage";
import InstituteCounselingPage from "../features/institute/InstituteCounselingPage";
import NewsLetterPage from "../features/newsLetter/NewsLetterPage";
import UserMessagesPage from "../features/messages/UserMessagesPage";
function CatchAll() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <NotFoundPage />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
 
 

  {
    path: "/admin",
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/login" replace /> },
          { path: "login", element: <LoginPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
          { path: "reset-password", element: <ResetPasswordPage /> },
          { path: "reset-password/:token", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/institute/login", element: <InstituteLoginPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
          { path: "/reset-password/:token", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: (
      <RequireAuth allowedLoginTypes={["institute"]} loginPath="/institute/login" />
    ),
    children: [
      {
        path: "/institute",
        element: <InstituteLayout />,
        children: [
          { index: true, element: <Navigate to="/institute/dashboard" replace /> },
          { path: "dashboard", element: <InstituteDashboardPage /> },
          { path: "students", element: <InstituteStudentsPage /> },
          { path: "psychometric-attempts", element: <InstituteAttemptsPage /> },
          { path: "counseling-reports", element: <InstituteCounselingPage /> },
          { path: "psychometric-attempts/:attemptId/report", element: <AssessmentReportPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <DashBoardlayout />,
        errorElement: <NotFoundPage />,
        children: [
          { path: "*", element: <NotFoundPage /> },
          { index: true, element: <Navigate to="/dashboard" replace /> },

          {
            path: "dashboard",
            element: (
              <PermissionRoute module="Dashboard">
                <DashboardPage />
              </PermissionRoute>
            ),
          },
          {
            path: "mentor",
            element: (
              <PermissionRoute module="Mentors">
                <MentorPage />
              </PermissionRoute>
            ),
          },
          {
            path: "all_users",
            element: (
              <PermissionRoute module="All Users">
                <AllUsers />
              </PermissionRoute>
            ),
            children: [
              { index: true, element: <AllUsersTab /> },
              { path: "active", element: <Active /> },
              { path: "banned", element: <Banned /> },
              { path: "email-unverified", element: <EmailUnverified /> },
              { path: "mobile-unverified", element: <MobileUnverified /> },
              { path: "with-balance", element: <WithBalance /> },
              { path: "notification", element: <NotificationToUser /> },
            ],
          },
          {
            path: "student-management",
            element: (
              <PermissionRoute module="Institutes">
                <Student />
              </PermissionRoute>
            ),
          },
          {
            path: "all_orders",
            element: <AdminOnly><AllOrder /></AdminOnly>,
            children: [
              { index: true, element: <Navigate to="/all_orders/approved" replace /> },
              { path: "approved", element: <ApprovedOrder /> },
              { path: "pending", element: <PendingOrder /> },
            ],
          },
          {
            path: "support_tickets",
            element: (
              <PermissionRoute module="Support Tickets">
                <SupportTickets />
              </PermissionRoute>
            ),
            children: [
              { index: true, element: <Navigate to="/support_tickets/all" replace /> },
              { path: "all", element: <AllTickets /> },
              { path: "pending", element: <PendingTickets /> },
              { path: "closed", element: <ClosedTickets /> },
              { path: "answered", element: <AnsweredTickets /> },
            ],
          },
          {
            path: "support_tickets/:ticketId",
            element: (
              <PermissionRoute module="Support Tickets">
                <TicketDetails />
              </PermissionRoute>
            ),
          },
          {
            path: "modules",
            element: (
              <AdminOnly>
                <ModulePage />
              </AdminOnly>
            ),
          },
          {
            path: "stream",
            element: (
              <PermissionRoute module="Stream">
                <StreamPage />
              </PermissionRoute>
            ),
          },
          {
            path: "categories",
            element: (
              <PermissionRoute module="Categories">
                <CategoryPage />
              </PermissionRoute>
            ),
          },
          {
            path: "2ndcategories",
            element: (
              <PermissionRoute module="Second Categories">
                <Category2Page />
              </PermissionRoute>
            ),
          },
          {
            path: "subcategories",
            element: (
              <PermissionRoute module="Subcategories">
                <SubCategoryPage />
              </PermissionRoute>
            ),
          },
          {
            path: "details",
            element: (
              <PermissionRoute module="Details">
                <DetailsPage />
              </PermissionRoute>
            ),
          },
          { path: "salary", element: (<PermissionRoute module="Salary"><SalaryPage /></PermissionRoute>) },
          { path: "jobscope", element:(<PermissionRoute module="Job Scope"><JobScopePage /></PermissionRoute>) },
          {
            path: "pathtype",
            element: (
              <PermissionRoute module="Path Type">
                <PathTypePage />
              </PermissionRoute>
            ),
          },
          {
            path: "careerpath",
            element: (
              <PermissionRoute module="Career Path">
                <CareerPathPage />
              </PermissionRoute>
            ),
          },
          {
            path: "entranceexam",
            element: (
              <PermissionRoute module="Entrance Exam">
                <EntranceExamPage />
              </PermissionRoute>
            ),
          },
          {
            path: "institution",
            element: (
              <PermissionRoute module="Institution">
                <InstitutionPage />
              </PermissionRoute>
            ),
          },
          {
            path: "scholarship",
            element: (
              <PermissionRoute module="Scholarship">
                <ScholarshipPage />
              </PermissionRoute>
            ),
          },
          {
            path: "masterclass",
            element: (
              <PermissionRoute module="Master Class">
                <MasterClassPage />
              </PermissionRoute>
            ),
          },
          { path: "studyabroad", element: (<PermissionRoute module="Study Abroad"><StudyAbroadPage /></PermissionRoute>) },
          { path: "careerplan", element: <AdminOnly><CareerPlanPage /></AdminOnly> },
          {
            path: "bookings",
            element: (
              <PermissionRoute module="Bookings">
                <BookingTable />
              </PermissionRoute>
            ),
          },
          {
            path: "subscribers",
            element: (
              <PermissionRoute module="Subscribers">
                <Subscribers />
              </PermissionRoute>
            ),
          },
          {
            path: "plans",
            element: (
              <PermissionRoute module="Plans">
                <PlansPage />
              </PermissionRoute>
            ),
          },
          { path: "subscriptions", element: <AdminOnly><SubscriptionsPage /></AdminOnly> },
          { path: "services", element: <AdminOnly><ServicesPage /></AdminOnly> },
          { path: "allcountries", element: <AdminOnly><CountriesPage /></AdminOnly> },
          { path: "states", element: <AdminOnly><StatesPage /></AdminOnly> },
          { path: "districts", element: <AdminOnly><DistrictsPage /></AdminOnly> },
          {
            path: "transactions",
            element: (
              <PermissionRoute module="Transactions">
                <TransactionsPage />
              </PermissionRoute>
            ),
          },
          {
            path: "loginactivities",
            element: (
              <PermissionRoute module="Login Activities">
                <LoginActivitiesPage />
              </PermissionRoute>
            ),
          },
          {
            path: "notifications",
            element: (
              <PermissionRoute module="Notifications">
                <NotificationsPage />
              </PermissionRoute>
            ),
          },
          { path: "logo-favicon", element: <AdminOnly><LogoFavicon /></AdminOnly> },
          { path: "email-notification/alltemplates", element: <AdminOnly><AllTemplatesPage /></AdminOnly> },
          { path: "email-notification/globaltemplates", element: <AdminOnly><GlobalTemplatePage /></AdminOnly> },
          { path: "email-notification/emailconfig", element: <AdminOnly><EmailConfigPage /></AdminOnly> },
          { path: "email-notification/smsconfig", element: <AdminOnly><SmsConfigPage /></AdminOnly> },
          { path: "jobs", element: <AdminOnly><JobPage /></AdminOnly> },
          { path: "jobs/add", element: <AdminOnly><JobFormPage mode="add" /></AdminOnly> },
          { path: "jobs/:jobId/edit", element: <AdminOnly><JobFormPage mode="edit" /></AdminOnly> },
          { path: "jobs/:jobId/view", element: <AdminOnly><JobFormPage mode="view" /></AdminOnly> },
          { path: "job-applications", element: <AdminOnly><JobApplicationsPage /></AdminOnly> },
          {
            path: "quiz",
            element: (
              <PermissionRoute module="Quiz">
                <QuizPage />
              </PermissionRoute>
            ),
          },
          {
            path: "quiz/:quizId/questions",
            element: (
              <PermissionRoute module="Quiz">
                <QuizQuestionsPage />
              </PermissionRoute>
            ),
          },
          { path: "globalsettings", element: <AdminOnly><GlobalSettingsPage /></AdminOnly> },
          { path: "profile", element: <ProfilePage /> },
          { path: "language", element: <AdminOnly><LanguagePage /></AdminOnly> },
          { path: "language/:languageId/keywords", element: <AdminOnly><LanguageKeywordsPage /></AdminOnly> },
          { path: "seo", element: <AdminOnly><SeoPage /></AdminOnly> },
          { path: "social-credential", element: <AdminOnly><SocialCredentialPage /></AdminOnly> },
          {
            path: "domains",
            element: (
              <PermissionRoute module="Domains">
                <Domain />
              </PermissionRoute>
            ),
          },
          {
            path: "assessment",
            element: (
              <PermissionRoute module="Assessment">
                <AssessmentPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-assessments",
            element: (
              <PermissionRoute module="Assessment">
                <AssessmentPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-assessments/:assessmentId/sections",
            element: (
              <PermissionRoute module="Assessment">
                <SectionPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-sections",
            element: (
              <PermissionRoute module="Assessment">
                <SectionPage />
              </PermissionRoute>
            ),
          },
          {
            path: "sections",
            element: (
              <PermissionRoute module="Assessment">
                <SectionPage />
              </PermissionRoute>
            ),
          },
          {
            path: "sections/:assessmentId",
            element: (
              <PermissionRoute module="Assessment">
                <SectionPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-assessments/:assessmentId/questions",
            element: (
              <PermissionRoute module="Assessment">
                <QuestionBankPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-sections/:sectionId/questions",
            element: (
              <PermissionRoute module="Assessment">
                <QuestionBankPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-questions",
            element: (
              <PermissionRoute module="Assessment">
                <QuestionBankPage />
              </PermissionRoute>
            ),
          },
          {
            path: "questions",
            element: (
              <PermissionRoute module="Assessment">
                <QuestionBankPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-career-clusters",
            element: (
              <PermissionRoute module="Assessment">
                <CareerClusterPage />
              </PermissionRoute>
            ),
          },
          {
            path: "career-categories",
            element: (
              <PermissionRoute module="Assessment">
                <CareerClusterPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-attempts",
            element: (
              <PermissionRoute module="Assessment">
                <StudentAttemptsPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-attempts/:attemptId/report",
            element: (
              <PermissionRoute module="Assessment">
                <AssessmentReportPage />
              </PermissionRoute>
            ),
          },
          {
            path: "admin/psychometric-report/:attemptId",
            element: (
              <PermissionRoute module="Assessment">
                <AssessmentReportPage />
              </PermissionRoute>
            ),
          },
          {
            path: "career-paths",
            element: (
              <PermissionRoute module="Career Paths">
                <CareerPath />
              </PermissionRoute>
            ),
          },
          {
            path: "institutes",
            element: (
              <PermissionRoute module="Institutes">
                <Institute />
              </PermissionRoute>
            ),
          },
          {
            path: "personality-test",
            element: (
              <PermissionRoute module="Personality Test">
                <StudentAttemptsPage />
              </PermissionRoute>
            ),
          },
          {
            path: "counseling",
            element: (
              <PermissionRoute module="Counseling">
                <Counseling />
              </PermissionRoute>
            ),
          },
          {
            path: "staff",
            element: (
              <AdminOnly>
                <Staff />
              </AdminOnly>
            ),
          },
          {
            path: "roles",
            element: (
              <AdminOnly>
                <RolePage />
              </AdminOnly>
            ),
          },
          {
            path: "permissions",
            element: (
              <AdminOnly>
                <Permission />
              </AdminOnly>
            ),
          },
          {
            path: "user-messages",
            element: <AdminOnly><UserMessagesPage /></AdminOnly>,
          },
          {
            path: "newsletter",
            element: (
              <PermissionRoute module="Newsletter">
                <NewsLetterPage />
              </PermissionRoute>
            ),
          },
        ],
      },
    ],
  },
  { path: "*", element: <CatchAll /> },
]);
