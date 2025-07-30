import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function SupportBySection() {
  return (
    <section className="scroll-mt-24 mt-16" id="support-by">
      <div className="flex flex-col justify-center items-center gap-2 mb-6 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">Support By:</h2>
        <div className="w-40 h-1 bg-primary rounded-full"></div>
      </div>

      <div className="py-6">
        <Marquee
          gradient={false}
          speed={40}
          pauseOnHover={true}
          className="py-4"
        >
          {[
            {
              name: "Badan Pemusyawaratan Desa",
              src: "/images/bpd.jpg",
            },
            {
              name: "Lembaga Pemberdayaan Masyarakat Desa",
              src: "/images/lpmd.jpg",
            },
            {
              name: "Pemberdayaan dan Kesejahteraan Keluarga",
              src: "/images/pkk.jpg",
            },
            {
              name: "Perlindungan Masyarakat",
              src: "/images/linmas.jpg",
            },
            {
              name: "Poskesdes",
              src: "/images/poskesdes.jpg",
            },
            {
              name: "Koperasi Wanita",
              src: "/images/kopwan.jpg",
            },
            { name: "Karang Taruna", src: "/images/karang-taruna.jpg" },
            { name: "Bhabinkamtibmas", src: "/images/binmas.jpg" },
            {
              name: "Gapoktan",
              src: "/images/gapoktan.jpg",
            },
          ].map((logo, index) => (
            <div key={index} className="mx-6">
              <div className="relative h-32 w-32 md:h-52 md:w-52">
                <Image
                  src={logo.src}
                  alt={`Logo ${logo.name}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
