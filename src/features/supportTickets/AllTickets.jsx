import SupportTicketsTable from "./SupportTicketsTable";
import useHelpAndSupportTickets from "./useHelpAndSupportTickets";

export default function AllTickets() {
  const { tickets, loading, updateTicketStatus } = useHelpAndSupportTickets();

  return (
    <SupportTicketsTable
      title="All Tickets"
      data={tickets}
      loading={loading}
      onUpdateStatus={updateTicketStatus}
    />
  );
}
