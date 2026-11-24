import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IMAGE_CREDITS } from "../../../../constants/imageCredits";

/**
 * Attribution for product photos from Wikimedia Commons. CC BY and CC BY-SA
 * licences require naming the author and licence and linking to both.
 */

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Credits and licences for the product photos used on Ojarun.",
};

function licenseUrl(license: string): string | null {
  const l = license.trim().toLowerCase();
  if (l === "cc0") return "https://creativecommons.org/publicdomain/zero/1.0/";
  if (l === "public domain") return null;
  const m = l.match(/^cc (by(?:-sa)?) (\d\.\d)(?: (\w+))?$/);
  if (!m) return null;
  const [, kind, version, port] = m;
  return `https://creativecommons.org/licenses/${kind}/${version}/${port ? `${port}/` : ""}`;
}

export default function PhotoCreditsPage() {
  return (
    <main className="flex flex-col">
      <Header />

      <section className="bg-primary text-white px-4 sm:px-8 pt-36 pb-14">
        <div className="mx-auto max-w-[1000px] flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-semibold">Photo credits</h1>
          <p className="text-white/80 max-w-2xl">
            Many of our product photos come from photographers who share their
            work on Wikimedia Commons. Thank you to each of them.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-10">
        <div className="mx-auto max-w-[1000px] flex flex-col gap-6">
          <p className="text-sm text-grey-400 leading-relaxed">
            The photos below are used under the licences shown, and may have been
            cropped or resized to fit the site. Click a licence to read its terms,
            or &quot;View original&quot; to see the photo and its full details.
          </p>

          <div className="overflow-x-auto rounded-xl border border-[#E7E7E7]">
            <table className="w-full text-sm">
              <thead className="bg-green-50 text-left text-primary">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Product</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Photo by</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Licence</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {IMAGE_CREDITS.map((credit) => {
                  const url = licenseUrl(credit.license);
                  return (
                    <tr key={`${credit.product}-${credit.source}`} className="border-t border-[#E7E7E7]">
                      <td className="px-4 py-3">{credit.product}</td>
                      <td className="px-4 py-3">{credit.author}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer license" className="text-primary underline">
                            {credit.license}
                          </a>
                        ) : (
                          credit.license
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a href={credit.source} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                          View original
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
