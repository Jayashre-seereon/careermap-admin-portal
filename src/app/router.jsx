import { createBrowserRouter, Navigate } from "react-router-dom";
import PermissionRoute from "./PermissionRoute";
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
import SignupPage from "../features/auth/SignupPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
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
import Career from "../features/psychometric/Career";
import CareerPath from "../features/psychometric/CareerPath";
import CareerCategory from "../features/psychometric/CareerCategory";
import Institute from "../features/psychometric/Institute";
import Question from "../features/psychometric/Question";
import Section from "../features/psychometric/Section";
import Student from "../features/psychometric/Student";
import PersonalityTest from "../features/personalityTest/PersonalityTest";
import Counseling from "../features/counseling/Counseling";
import Staff from "../features/staff/Staff";
import Permission from "../features/permission/Permission";
import InstituteLayout from "../components/institute/InstituteLayout";
import InstituteDashboardPage from "../pages/InstituteDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/institute/login", element: <InstituteLoginPage /> },
          { path: "/signup", element: <SignupPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
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
        children: [
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
            path: "all_orders",
            element: <AllOrder />,
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
              <PermissionRoute module="Modules">
                <ModulePage />
              </PermissionRoute>
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
          { path: "salary", element: <SalaryPage /> },
          { path: "jobscope", element: <JobScopePage /> },
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
          { path: "studyabroad", element: <StudyAbroadPage /> },
          { path: "careerplan", element: <CareerPlanPage /> },
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
              <PermissionRoute module="PlansQuiz">
                <PlansPage />
              </PermissionRoute>
            ),
          },
          { path: "subscriptions", element: <SubscriptionsPage /> },
          { path: "services", element: <ServicesPage /> },
          { path: "allcountries", element: <CountriesPage /> },
          { path: "states", element: <StatesPage /> },
          { path: "districts", element: <DistrictsPage /> },
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
          { path: "logo-favicon", element: <LogoFavicon /> },
          { path: "email-notification/alltemplates", element: <AllTemplatesPage /> },
          { path: "email-notification/globaltemplates", element: <GlobalTemplatePage /> },
          { path: "email-notification/emailconfig", element: <EmailConfigPage /> },
          { path: "email-notification/smsconfig", element: <SmsConfigPage /> },
          { path: "jobs", element: <JobPage /> },
          { path: "jobs/add", element: <JobFormPage mode="add" /> },
          { path: "jobs/:jobId/edit", element: <JobFormPage mode="edit" /> },
          { path: "jobs/:jobId/view", element: <JobFormPage mode="view" /> },
          { path: "job-applications", element: <JobApplicationsPage /> },
          {
            path: "quiz",
            element: (
              <PermissionRoute module="PlansQuiz">
                <QuizPage />
              </PermissionRoute>
            ),
          },
          {
            path: "quiz/:quizId/questions",
            element: (
              <PermissionRoute module="PlansQuiz">
                <QuizQuestionsPage />
              </PermissionRoute>
            ),
          },
          { path: "globalsettings", element: <GlobalSettingsPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "language", element: <LanguagePage /> },
          { path: "language/:languageId/keywords", element: <LanguageKeywordsPage /> },
          { path: "seo", element: <SeoPage /> },
          { path: "social-credential", element: <SocialCredentialPage /> },
          {
            path: "domains",
            element: (
              <PermissionRoute module="Domains">
                <Domain />
              </PermissionRoute>
            ),
          },
          {
            path: "careers",
            element: (
              <PermissionRoute module="Careers">
                <Career />
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
            path: "career-categories",
            element: (
              <PermissionRoute module="Career Categories">
                <CareerCategory />
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
            path: "questions",
            element: (
              <PermissionRoute module="Questions">
                <Question />
              </PermissionRoute>
            ),
          },
          {
            path: "sections",
            element: (
              <PermissionRoute module="Sections">
                <Section />
              </PermissionRoute>
            ),
          },
          {
            path: "students",
            element: (
              <PermissionRoute module="Students">
                <Student />
              </PermissionRoute>
            ),
          },
          {
            path: "personality-test",
            element: (
              <PermissionRoute module="Personality Test">
                <PersonalityTest />
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
              <PermissionRoute module="Staff">
                <Staff />
              </PermissionRoute>
            ),
          },
          {
            path: "permissions",
            element: (
              <PermissionRoute module="Permissions">
                <Permission />
              </PermissionRoute>
            ),
          },
        ],
      },
    ],
  },
]);
