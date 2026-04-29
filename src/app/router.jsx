import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import DashBoardlayout from "../components/layout/DashBoardlayout";
import MentorPage from "../features/mentor/MentorPage";
import AllUsers from "../features/allUser";
import AllUsersTab from "../features/allUser/tabs/AllUsers";
import Active from "../features/allUser/tabs/Active";
import Banned from "../features/allUser/tabs/Banned";
import EmailUnverified from "../features/allUser/tabs/EmailUnverified";
import MobileUnverified from "../features/allUser/tabs/MobileUnverified";
import Subscribers from "../features/allUser/tabs/Subscribers";
import WithBalance from "../features/allUser/tabs/WithBalance";
import NotificationToUser from "../features/allUser/tabs/NotificationToUser";
import UserDetails from "../features/allUser/tabs/UserDetails";
import ModulePage from "../features/modules/ModulePage";
import StreamPage from "../features/stream/StreamPage";
import CategoryPage from "../features/categories/CategoryPage";
import Category2Page from "../features/2ndcategories/Category2Page";
import SubCategoryPage from "../features/subcategories/SubCategoryPage";
import SalaryPage from "../features/salary/SalaryPage";
import JobScopePage from "../features/jobscope/JobScopePage";
import RequireAuth from "../features/auth/RequireAuth";
import PublicOnlyRoute from "../features/auth/PublicOnlyRoute";
import AuthLayout from "../features/auth/AuthLayout";
import LoginPage from "../features/auth/LoginPage";
import SignupPage from "../features/auth/SignupPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import RootRedirect from "../features/auth/RootRedirect";
import PathTypePage from "../features/pathtype/PathTypePage";
import CareerPathPage from "../features/careerpath/CareerPathPage";
import EntranceExamPage from "../features/entranceexam/EntranceExamPage";
import InstitutionPage from "../features/institution/InstitutionPage";
import ScholarshipPage from "../features/scholarship/ScholarshipPage";
import CareerPlanPage from "../features/careerplan/CareerPlanPage";
import AllOrder from "../features/AllOrders/AllOrder";
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
             { path: "/forgot-password", element: <ForgotPasswordPage /> },
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
          { path: "dashboard", element: <DashboardPage /> },
          { path: "mentor", element: <MentorPage /> },
          {
            path: "all_users",
            element: <AllUsers />,
            children: [
              { index: true, element: <AllUsersTab /> },
              { path: "active", element: <Active /> },
              { path: "banned", element: <Banned /> },
              { path: "email-unverified", element: <EmailUnverified /> },
              { path: "mobile-unverified", element: <MobileUnverified /> },
              { path: "subscribers", element: <Subscribers /> },
              { path: "with-balance", element: <WithBalance /> },
              { path: "notification", element: <NotificationToUser /> },
            ],
          },
          {path:"all_orders", element:<AllOrder/>,
            children:[
              { index: true, element: <Navigate to="/all_orders/approved" replace /> },
              { path: "approved", element: <ApprovedOrder /> },
              { path: "pending", element: <PendingOrder /> },
            ] 
          },
          {
            path: "support_tickets",
            element: <SupportTickets />,
            children: [
              { index: true, element: <Navigate to="/support_tickets/all" replace /> },
              { path: "all", element: <AllTickets /> },
              { path: "pending", element: <PendingTickets /> },
              { path: "closed", element: <ClosedTickets /> },
              { path: "answered", element: <AnsweredTickets /> },
            ],
          },
          { path: "support_tickets/:ticketId", element: <TicketDetails /> },
          { path: "modules", element: <ModulePage /> },
          { path: "stream", element: <StreamPage /> },
          { path: "categories", element: <CategoryPage /> },
          { path: "2ndcategories", element: <Category2Page /> },
          { path: "subcategories", element: <SubCategoryPage /> },
          { path: "salary", element: <SalaryPage /> },
          { path: "jobscope", element: <JobScopePage /> },
          { path: "pathtype", element: <PathTypePage /> },
          { path: "careerpath", element: <CareerPathPage /> },
          { path: "entranceexam", element: <EntranceExamPage /> },
          { path: "institution", element: <InstitutionPage /> },
          { path: "scholarship", element: <ScholarshipPage /> },
          { path: "careerplan", element: <CareerPlanPage /> },
          { path: "bookings", element: <BookingTable /> },
          { path: "plans", element: <PlansPage /> },
          { path: "services", element: <ServicesPage /> },
          { path: "allcountries", element: <CountriesPage /> },
          { path: "states", element: <StatesPage /> },
          { path: "districts", element: <DistrictsPage /> },
          { path: "transactions", element: <TransactionsPage /> },
          { path: "loginactivities", element: <LoginActivitiesPage /> },
          { path: "notifications", element: <NotificationsPage /> },
          { path: "logo-favicon", element: <LogoFavicon /> },
          { path: "email-notification/alltemplates", element: <AllTemplatesPage /> },
          { path: "email-notification/globaltemplates", element: <GlobalTemplatePage /> },
          { path: "email-notification/emailconfig", element: <EmailConfigPage /> },
          { path: "email-notification/smsconfig", element: <SmsConfigPage /> },
          { path: "jobs", element: <JobPage /> },
          { path: "jobs/add", element: <JobFormPage mode="add" /> },
          { path: "jobs/:jobId/edit", element: <JobFormPage mode="edit" /> },
          { path: "job-applications", element: <JobApplicationsPage /> },
          { path: "quiz", element: <QuizPage /> },
          { path: "quiz/:quizId/questions", element: <QuizQuestionsPage /> },
          { path: "globalsettings", element: <GlobalSettingsPage /> },
          { path: "language", element: <LanguagePage /> },
          { path: "language/:languageId/keywords", element: <LanguageKeywordsPage /> },
          { path: "seo", element: <SeoPage /> },
          { path: "social-credential", element: <SocialCredentialPage /> },
        ],
      },
    ],
  },
]);
