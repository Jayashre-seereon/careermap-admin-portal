import SupportTicketsTable from "./SupportTicketsTable";
import useHelpAndSupportTickets from "./useHelpAndSupportTickets";
import { filterTicketsByStatus } from "./supportTicketsUtils";

export default function PendingTickets() {
  const { tickets, loading, updateTicketStatus } = useHelpAndSupportTickets();
  const pendingTickets = filterTicketsByStatus(tickets, "pending");

  return (
    <SupportTicketsTable
      title="Pending Tickets"
      data={pendingTickets}
      loading={loading}
      onUpdateStatus={updateTicketStatus}
    />
  );
}
