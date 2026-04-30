import type { Prospect } from "@/lib/prospects";

interface Props {
  prospect: Prospect;
}

export default function ProspectPainPoints({ prospect }: Props) {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            Was ich bei {prospect.companyName} sehe
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-12 text-gray-900"
            style={{ fontFamily: prospect.fontFamily }}
          >
            Drei Stellen, an denen Geld verloren geht.
          </h2>

          <ul className="space-y-8">
          {prospect.painBullets.map((bullet, i) => (
            <li key={i} className="flex gap-5">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: prospect.primaryColor }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed pt-1">
                {bullet}
              </p>
            </li>
          ))}
          </ul>
        </div>

        <div className="order-first lg:order-last">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${prospect.trade}/pain.png`}
            alt={`Schreibtisch eines ${prospect.companyName}-Geschäftsführers am Abend`}
            className="w-full h-auto rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
