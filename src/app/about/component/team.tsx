import Image from "next/image";

const team = [
  { name: "John Doe", title: "Chief Executive Officer", image: "/assets/team-1.png" },
  { name: "John Doe", title: "Chief Executive Officer", image: "/assets/team-2.png" },
  { name: "John Doe", title: "Chief Executive Officer", image: "/assets/team-3.png" },
];

export default function Team() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-310 px-6 py-15 sm:px-0">
        {/* Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-semibold text-black sm:text-4xl">
            Our Team
          </h2>
          <p className="text-base leading-6 tracking-[-0.02em] text-black/70">
            We&apos;re a team of builders and problem solvers focused on
            improving real world experiences
          </p>
        </div>

        {/* Cards row — Figma: 1240×446, py 12, justify-between */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 py-3 sm:flex-row sm:gap-0">
          {team.map((member, i) => (
            <TeamCard key={i} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({
  name,
  title,
  image,
}: {
  name: string;
  title: string;
  image: string;
}) {
  return (
    // Card — Figma: 397×422 (with green tab extending below). max-w-full so it shrinks below 397
    <div className="relative h-[422px] w-full max-w-[397px]">
      {/* Green back layer — Figma: 397×336, top 98, radius 24. Only the bottom tab shows */}
      <div className="absolute inset-x-0 top-[98px] h-[336px] rounded-3xl bg-primary" />

      {/* Yellow card body — Figma: 397×402, top 12. Sits on top of green, hiding everything except the bottom tab */}
      <div className="absolute inset-x-0 top-3 h-[402px] rounded-2xl bg-[#FFF2B8]" />

      {/* Photo + text frame — Figma: 377×380, top 23, 10px gutter each side, radius 8, 3px green border */}
      <div className="absolute left-2.5 right-2.5 top-[23px] flex h-[380px] flex-col overflow-hidden rounded-lg border-[3px] border-primary bg-white">
        {/* Photo */}
        <div className="relative flex-1">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 90vw, 377px"
            className="object-cover"
          />
        </div>

        {/* Divider + Name + title */}
        <div className="flex flex-col items-center justify-center border-t border-black/10 bg-white px-4 py-3">
          <p className="text-base leading-6 tracking-[-0.02em] text-black">
            {name}
          </p>
          <p className="text-sm leading-5 tracking-[-0.02em] text-black/70">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
