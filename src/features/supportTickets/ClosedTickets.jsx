import SupportTicketsTable from "./SupportTicketsTable";
import { ticketsData } from "./ticketsData";

export default function ClosedTickets() {
  const closedTickets = ticketsData.filter((ticket) => ticket.status === "Closed");

  return <SupportTicketsTable title="Closed Tickets" data={closedTickets} />;
}
