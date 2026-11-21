import React, { FC } from "react";

interface HeroSubProps {
  title: string;
  description: string;
}

const HeroSub: FC<HeroSubProps> = ({ title, description }) => {
  return (
    <section className="text-center md:pb-28 pb-10 bg-primary relative z-20 py-20">
      <h1 className="text-white">{title}</h1>
      <p className="text-xl text-white font-normal max-w-720 w-full mx-auto my-[1.875rem] sm:px-0 px-4">
        {description}
      </p>
    </section>
  );
};

export default HeroSub;
