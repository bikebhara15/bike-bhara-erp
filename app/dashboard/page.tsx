"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import AppShell from "@/components/AppShell";

type Expiry={model:string;registration_no:string;registration_expiry:string|null;tax_token_expiry:string|null};
export default function Dashboard(){
  const [k,setK]=useState({bikes:0,customers:0,bookings:0,rentals:0,income:0,expense:0});
  const [expiry,setExpiry]=useState<Expiry[]>([]);
  useEffect(()=>{load()},[]);
  async function load(){
    const s=createClient();
    const [b,c,bk,r,tx]=await Promise.all([
      s.from("bikes").select("*"),s.from("customers").select("*"),s.from("bookings").select("*"),
      s.from("rentals").select("*"),s.from("transactions").select("*")
    ]);
    const trans=tx.data??[];
    setK({bikes:b.data?.length??0,customers:c.data?.length??0,
      bookings:(bk.data??[]).filter(x=>x.status==="pending").length,
      rentals:(r.data??[]).filter(x=>x.status==="active").length,
      income:trans.filter(x=>x.type==="income").reduce((a,x)=>a+Number(x.amount),0),
      expense:trans.filter(x=>x.type==="expense").reduce((a,x)=>a+Number(x.amount),0)});
    setExpiry((b.data??[]).slice(0,10));
  }
  function days(date:string|null){if(!date)return null;return Math.ceil((new Date(date).getTime()-Date.now())/86400000)}
  return <AppShell>
    <h1>Dashboard</h1>
    <div className="cards">
      <div className="card"><span>মোট বাইক</span><strong>{k.bikes}</strong></div>
      <div className="card"><span>Customers</span><strong>{k.customers}</strong></div>
      <div className="card"><span>Pending Booking</span><strong>{k.bookings}</strong></div>
      <div className="card"><span>Active Rental</span><strong>{k.rentals}</strong></div>
      <div className="card"><span>Income</span><strong>৳ {k.income.toLocaleString()}</strong></div>
      <div className="card"><span>Expense</span><strong>৳ {k.expense.toLocaleString()}</strong></div>
      <div className="card"><span>Net</span><strong>৳ {(k.income-k.expense).toLocaleString()}</strong></div>
    </div>
    <div className="panel"><h2>Registration ও Tax Token Expiry</h2>
      <table><thead><tr><th>Bike</th><th>Registration</th><th>Tax Token</th><th>Nearest Days</th></tr></thead>
      <tbody>{expiry.map(x=>{const values=[days(x.registration_expiry),days(x.tax_token_expiry)].filter(v=>v!==null) as number[];const d=values.length?Math.min(...values):null;
      return <tr key={x.registration_no}><td>{x.model}<br/>{x.registration_no}</td><td>{x.registration_expiry||"-"}</td><td>{x.tax_token_expiry||"-"}</td><td><span className={"badge "+(d===null?"ok":d<=15?"danger":d<=30?"warn":"ok")}>{d===null?"N/A":d+" days"}</span></td></tr>})}</tbody></table>
    </div>
  </AppShell>
}
