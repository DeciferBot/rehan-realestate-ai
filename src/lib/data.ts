import "server-only";
import { getSupabaseAdmin } from "./supabase-server";

/**
 * Server-side data access layer for the command center.
 *
 * Each fetcher reads from Supabase (via the service role) and maps DB
 * snake_case columns back to the camelCase field names the console pages
 * already render — so the UI is identical, just backed by real data.
 */

export type Lead = {
  id: string;
  name: string;
  phone: string;
  language: string;
  flag: string;
  status: string;
  propertyInterest: string;
  investType: string;
  source: string;
  assignedAgent: string;
  time: string;
  budget: string;
};

export type Property = {
  id: string;
  developer: string;
  name: string;
  location: string;
  type: string;
  bedrooms: number;
  price: number;
  currency: string;
  roi: number;
  rentalYield: number;
  image: string;
  tags: string[];
  completion: string;
  sqft: number;
  description: string;
  amenities: string[];
  floors: string;
};

export type Appointment = {
  id: string;
  lead: string;
  type: string;
  agent: string;
  date: string;
  time: string;
  property: string;
  status: string;
  notes: string;
};

export type Developer = {
  id: string;
  name: string;
  logo: string;
  properties: number;
  activeListings: number;
  totalValue: string;
  onedrive: boolean;
  lastSync: string;
};

export async function getLeads(): Promise<Lead[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    language: r.language,
    flag: r.flag,
    status: r.status,
    propertyInterest: r.property_interest,
    investType: r.invest_type,
    source: r.source,
    assignedAgent: r.assigned_agent,
    time: r.time_label,
    budget: r.budget,
  }));
}

export async function getProperties(): Promise<Property[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("properties").select("*").order("id");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    developer: r.developer,
    name: r.name,
    location: r.location,
    type: r.type,
    bedrooms: r.bedrooms,
    price: Number(r.price),
    currency: r.currency,
    roi: Number(r.roi),
    rentalYield: Number(r.rental_yield),
    image: r.image,
    tags: r.tags ?? [],
    completion: r.completion,
    sqft: r.sqft,
    description: r.description,
    amenities: r.amenities ?? [],
    floors: r.floors,
  }));
}

export async function getAppointments(): Promise<Appointment[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("appointments")
    .select("*")
    .order("date")
    .order("time");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    lead: r.lead,
    type: r.type,
    agent: r.agent,
    date: r.date,
    time: r.time,
    property: r.property,
    status: r.status,
    notes: r.notes,
  }));
}

export async function getDevelopers(): Promise<Developer[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("developers").select("*").order("id");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    logo: r.logo,
    properties: r.properties,
    activeListings: r.active_listings,
    totalValue: r.total_value,
    onedrive: r.onedrive,
    lastSync: r.last_sync,
  }));
}
