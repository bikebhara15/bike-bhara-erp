"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AppShell({children}:{children:React.ReactNode}) {
  const router = useRouter();
  async function logout() {
    await createClient().auth.signOut();
    router.push("/login");
  }
  return <div className="shell">
    <header>
      <div className="brand">
        <Image src="/logo.png" alt="Bike Bhara" width={70} height={66}/>
        <div><h2>বাইক ভাড়া ERP</h2><small>প্রবাসীর ছুটির সেরা সঙ্গী</small></div>
      </div>
      <button onClick={logout}>Logout</button>
    </header>
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/bikes">Bikes</Link>
      <Link href="/customers">Customers</Link>
      <Link href="/bookings">Bookings</Link>
      <Link href="/rentals">Rentals</Link>
    </nav>
    <main>{children}</main>
    <footer>Airport Road, Dishabond Chaumuhani, Sadar Dakshin, Cumilla · 01805749424 · 01805749425</footer>
  </div>
}
