import SupportTicketsTable from "./SupportTicketsTable";
import useHelpAndSupportTickets from "./useHelpAndSupportTickets";
import { filterTicketsByStatus } from "./supportTicketsUtils";

export default function ClosedTickets() {
  const { tickets, loading, updateTicketStatus } = useHelpAndSupportTickets();
  const closedTickets = filterTicketsByStatus(tickets, "closed");

  return (
    <SupportTicketsTable
      title="Closed Tickets"
      data={closedTickets}
      loading={loading}
      onUpdateStatus={updateTicketStatus}
    />
  );
}
