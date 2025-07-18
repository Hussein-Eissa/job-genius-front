
import { Heart, Umbrella, Monitor, Users, MapPin, Bus, HandHelping } from 'lucide-react';

interface BenefitProps {
  title: string;
  description: string;
}

const Benefit = ({ title, description }: BenefitProps) => (
  <div className="flex flex-col items-start  bg-white rounded-lg p-4 w-[300px]" >
    <div className="text-jobblue mb-3">{<HandHelping className="h-8 w-8" />}</div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const JobBenefits = ( { benefits }: { benefits: BenefitProps[] }) => {


  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Perks & Benefits</h2>
        <p className="text-gray-600 mb-8">This job comes with several perks and benefits</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.slice(0, 4).map((benefit, index) => (
            <Benefit key={index} {...benefit} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {benefits.slice(4).map((benefit, index) => (
            <Benefit key={index + 4} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobBenefits;
