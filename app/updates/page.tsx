"use client";

import { useEffect, useState } from "react";

type WebsiteUpdate = {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
};

const updates: WebsiteUpdate[] = [
  {
    id: "national-coffee-day-2026",
    title: "National Coffee Day",
    description: "1 cookie + 1 iced latte for only 15 AED ♡",
    image: "/images/updates/national-coffee-day.png",
    startDate: "2026-09-01",
    endDate: "2026-10-01",
  },
];

const getDubaiDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
  }).format(new Date());

export default function UpdatesPage() {
  const [activeUpdates, setActiveUpdates] = useState<
    WebsiteUpdate[]
  >([]);

  useEffect(() => {
    const today = getDubaiDate();

    const current = updates.filter(
      (update) =>
        today >= update.startDate &&
        today <= update.endDate
    );

    setActiveUpdates(current);
  }, []);

  return (
    <main className="min-h-screen bg-[#fffaf7] px-5 py-10 text-[#332321] md:px-12 md:py-16">
      <div className="mx-auto max-w-5xl">

        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#a95d73] transition hover:text-[#d9567c]"
        >
          ← Cookie Corner
        </a>

        <div className="mt-10">
          <p className="font-serif text-2xl italic text-[#d9567c]">
            fresh from the oven
          </p>

          <h1 className="mt-1 font-serif text-6xl font-black tracking-[-0.07em] md:text-8xl">
            updates.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-[#765852]">
            New offers, special drops and little Cookie Corner
            updates ♡
          </p>
        </div>

        {activeUpdates.length > 0 ? (
          <div className="mt-12 space-y-10">
            {activeUpdates.map((update) => (
              <article
                key={update.id}
                className="overflow-hidden rounded-[2rem] border-2 border-[#f0c5d0] bg-white shadow-sm"
              >
                <img
                  src={update.image}
                  alt={update.title}
                  className="h-auto w-full object-cover"
                />

                <div className="px-6 py-7 md:px-9 md:py-9">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d9567c]">
                    currently happening
                  </p>

                  <h2 className="mt-2 font-serif text-4xl font-black tracking-[-0.05em]">
                    {update.title}
                  </h2>

                  <p className="mt-3 text-base text-[#765852]">
                    {update.description}
                  </p>

                  <a
                    href="/#menu"
                    className="mt-6 inline-block rounded-full bg-[#bd7186] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5"
                  >
                    Order now
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[2rem] border-2 border-dashed border-[#e7cbd2] bg-white px-6 py-16 text-center">
            <p className="font-serif text-3xl font-black">
              nothing new right now ♡
            </p>

            <p className="mt-3 text-sm text-[#765852]">
              Check back soon for new Cookie Corner drops.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}