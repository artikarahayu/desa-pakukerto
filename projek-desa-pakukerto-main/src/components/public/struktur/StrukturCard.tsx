import { Card, CardContent } from "@/components/ui/card";
import { StrukturPublicData } from "@/lib/public/struktur";
import Image from "next/image";

interface StrukturCardProps {
  pejabat: StrukturPublicData;
  index?: number;
  isHome?: boolean;
}

const StrukturCard: React.FC<StrukturCardProps> = ({
  pejabat,
  index = 0,
  isHome = false,
}) => {
  return (
    <Card
      key={pejabat.id}
      className={`group bg-background rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-border ${
        isHome ? "min-w-52" : ""
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={pejabat.foto}
          alt={pejabat.nama}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
      <CardContent className="lg:p-2 text-center">
        <h3 className="text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {pejabat.nama}
        </h3>
        <p className="text-card-foreground/70 leading-relaxed">
          {pejabat.jabatan}
        </p>
      </CardContent>
    </Card>
  );
};

export default StrukturCard;
