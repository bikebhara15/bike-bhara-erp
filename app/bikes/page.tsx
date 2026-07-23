"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase";

type Bike = {
  id: string;
  model: string;
  registration_no: string;
  status: string;
  purchase_price: number;
  registration_expiry: string | null;
  tax_token_expiry: string | null;
};

const emptyForm = {
  model: "",
  registration_no: "",
  purchase_price: "",
  registration_expiry: "",
  tax_token_expiry: "",
  status: "available",
};

export default function BikesPage() {
  const [rows, setRows] = useState<Bike[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBikes();
  }, []);

  async function loadBikes() {
    const { data, error } = await createClient()
      .from("bikes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setIsError(true);
      setMessage(`Bike list load হয়নি: ${error.message}`);
      return;
    }

    setRows(data ?? []);
  }

  async function saveBike(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setIsError(false);

    const payload = {
      model: form.model.trim(),
      registration_no: form.registration_no.trim(),
      purchase_price: Number(form.purchase_price || 0),
      registration_expiry: form.registration_expiry || null,
      tax_token_expiry: form.tax_token_expiry || null,
      status: form.status,
    };

    const { error } = await createClient().from("bikes").insert(payload);

    setSaving(false);

    if (error) {
      setIsError(true);
      setMessage(`Save হয়নি: ${error.message}`);
      return;
    }

    setMessage("Bike সফলভাবে Save হয়েছে।");
    setForm(emptyForm);
    await loadBikes();
  }

  return (
    <AppShell>
      <h1>Bike Management</h1>

      {message && (
        <div className={isError ? "error" : "notice"}>{message}</div>
      )}

      <div className="grid2">
        <form className="panel" onSubmit={saveBike}>
          <label>
            Model
            <input
              required
              value={form.model}
              onChange={(event) =>
                setForm({ ...form, model: event.target.value })
              }
            />
          </label>

          <label>
            Registration No.
            <input
              required
              value={form.registration_no}
              onChange={(event) =>
                setForm({ ...form, registration_no: event.target.value })
              }
            />
          </label>

          <label>
            Purchase Price
            <input
              type="number"
              min="0"
              value={form.purchase_price}
              onChange={(event) =>
                setForm({ ...form, purchase_price: event.target.value })
              }
            />
          </label>

          <label>
            Registration Expiry
            <input
              type="date"
              value={form.registration_expiry}
              onChange={(event) =>
                setForm({
                  ...form,
                  registration_expiry: event.target.value,
                })
              }
            />
          </label>

          <label>
            Tax Token Expiry
            <input
              type="date"
              value={form.tax_token_expiry}
              onChange={(event) =>
                setForm({
                  ...form,
                  tax_token_expiry: event.target.value,
                })
              }
            />
          </label>

          <label>
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value })
              }
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="service">Service</option>
            </select>
          </label>

          <button disabled={saving}>
            {saving ? "Saving..." : "Save Bike"}
          </button>
        </form>

        <div className="panel">
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Registration</th>
                <th>Status</th>
                <th>Purchase Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((bike) => (
                <tr key={bike.id}>
                  <td>{bike.model}</td>
                  <td>{bike.registration_no}</td>
                  <td>{bike.status}</td>
                  <td>৳ {Number(bike.purchase_price || 0).toLocaleString()}</td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={4}>এখনও কোনো Bike Save করা হয়নি।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
