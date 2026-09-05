import { redirect } from 'next/navigation';

// /dashboard/customers redirects to /customers (the proper route)
export default function DashboardCustomersRedirect() {
  redirect('/customers');
}
