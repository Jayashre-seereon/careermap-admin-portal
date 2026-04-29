import SupportTicketsTable from "./SupportTicketsTable";
import { ticketsData } from "./ticketsData";

export default function AnsweredTickets() {
  const answeredTickets = ticketsData.filter((ticket) => ticket.status === "Answered");

  return <SupportTicketsTable title="Answered Tickets" data={answeredTickets} />;
}
