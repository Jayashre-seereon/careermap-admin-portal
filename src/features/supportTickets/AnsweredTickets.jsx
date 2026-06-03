import SupportTicketsTable from "./SupportTicketsTable";
import useHelpAndSupportTickets from "./useHelpAndSupportTickets";
import { filterTicketsByStatus } from "./supportTicketsUtils";

export default function AnsweredTickets() {
  const { tickets, loading, updateTicketStatus } = useHelpAndSupportTickets();
  const answeredTickets = filterTicketsByStatus(tickets, "answered");

  return (
    <SupportTicketsTable
      title="Answered Tickets"
      data={answeredTickets}
      loading={loading}
      onUpdateStatus={updateTicketStatus}
    />
  );
}
