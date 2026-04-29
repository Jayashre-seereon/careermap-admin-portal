import SupportTicketsTable from "./SupportTicketsTable";
import { ticketsData } from "./ticketsData";

export default function PendingTickets() {
  const pendingTickets = ticketsData.filter((ticket) => ticket.status === "Pending");

  return <SupportTicketsTable title="Pending Tickets" data={pendingTickets} />;
}
