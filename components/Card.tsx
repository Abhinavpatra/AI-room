"use client";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useRouter } from "next/navigation";

interface CardProps {
  title: string;
  description: string;
  identifier: string;
}

export function Card({ title, description, identifier }: CardProps) {
  const router = useRouter();

  const handleTryIt = (): void => {
    // Convert the identifier to slug format (replace / with --)
    const slug = identifier.replace("/", "--");
    router.push(`/model/${slug}`);
  };

  return (
    <CardSpotlight className="h-60 m-10 w-96 border-white-2">
      <div className="h-[85%]">
        <p className="text-xl font-bold relative z-20 text-white">
          {title}
        </p>
        <div className="text-neutral-200 mt-4 relative z-20">
          <ul className="list-none mt-2">
            {description}
          </ul>
        </div>
      </div>
      <p className="text-neutral-300 mt-4 relative z-20 text-sm">
        <button
          onClick={handleTryIt}
          className="focus:translate-y-0.5 transition duration-150 py-2 bg-black text-white rounded-lg transform font-light hover:-translate-y-1"
        >
          Try it!
        </button>
      </p>
    </CardSpotlight>
  );
}