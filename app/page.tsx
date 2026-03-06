"use client";

import { useEffect, useState } from "react";

type DropletStatus = {
  id: number;
  name: string;
  status: string;
  uptime: string;
  region: string;
  ip: string;
  memoryMb: number | null;
  vcpus: number | null;
  diskGb: number | null;
  checkedAt: string;
};

export default function Home() {
  const [droplet, setDroplet] = useState<DropletStatus | null>(null);
  const [dropletError, setDropletError] = useState<string | null>(null);

  useEffect(() => {
    const loadDroplet = async () => {
      try {
        const res = await fetch("/api/droplet-status", { cache: "no-store" });
        const data = (await res.json()) as DropletStatus & { error?: string };

        if (!res.ok) {
          setDropletError(data.error ?? "Could not load DigitalOcean status");
          return;
        }

        setDroplet(data);
      } catch {
        setDropletError("Could not load DigitalOcean status");
      }
    };

    loadDroplet();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <p className="text-sm text-zinc-400">Personal Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-1">🚀 Purunjay&apos;s Homelab</h1>
          <p className="text-zinc-300 mt-2 text-sm md:text-base">
            Quick overview of my self-hosted setup.
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <p className="text-xs text-zinc-400">Total VMs</p>
            <p className="text-xl font-semibold">4</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <p className="text-xs text-zinc-400">Running</p>
            <p className="text-xl font-semibold text-green-400">3</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <p className="text-xs text-zinc-400">Alerts</p>
            <p className="text-xl font-semibold text-yellow-300">1</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <p className="text-xs text-zinc-400">Public Status</p>
            <p className="text-xl font-semibold text-green-400">Online</p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
            <h2 className="text-lg font-semibold mb-3">🖥 Proxmox VE</h2>
            <p className="text-zinc-300">Status: 🟢 Online</p>
            <p className="text-zinc-300">Uptime: 3 Days 4 Hours</p>
            <p className="text-zinc-400 text-sm mt-2">CPU: 24% | RAM: 58%</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
            <h2 className="text-lg font-semibold mb-3">🐉 Kali Linux</h2>
            <p className="text-zinc-300">Status: 🟢 Running</p>
            <p className="text-zinc-300">IP: 192.168.29.234</p>
            <p className="text-zinc-400 text-sm mt-2">Notes: Pentesting VM</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
            <h2 className="text-lg font-semibold mb-3">☁️ DigitalOcean VM</h2>
            {droplet ? (
              <>
                <p className="text-zinc-300">Name: {droplet.name}</p>
                <p className="text-zinc-300">
                  Status: {droplet.status === "active" ? "🟢 Active" : `🟡 ${droplet.status}`}
                </p>
                <p className="text-zinc-300">Uptime: {droplet.uptime}</p>
                <p className="text-zinc-400 text-sm mt-2">
                  {droplet.ip} • {droplet.region}
                </p>
              </>
            ) : (
              <>
                <p className="text-zinc-300">Status: Loading...</p>
                {dropletError ? <p className="text-red-300 text-sm mt-2">{dropletError}</p> : null}
              </>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
            <h2 className="text-lg font-semibold mb-3">🌍 Public Access</h2>
            <p className="text-zinc-300">Cloudflare Tunnel: 🟢 Active</p>
            <p className="text-zinc-300">SSH: Enabled</p>
            <p className="text-zinc-400 text-sm mt-2">Domain: homelab.example.com</p>
          </div>
        </section>

        <footer className="mt-8 text-xs text-zinc-500">Last updated manually • v0.2</footer>
      </div>
    </main>
  );
}
