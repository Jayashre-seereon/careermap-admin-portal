import SupportTicketsTable from "./SupportTicketsTable";
import { ticketsData } from "./ticketsData";

export default function AllTickets() {
  return <SupportTicketsTable title="All Tickets" data={ticketsData} />;
}
