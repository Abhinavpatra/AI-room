import { Card } from "@/components/Card";

export default function Home() {
  return (
    <div className="bg-black h-screen flex flex-col overflow-x-scroll no-scrollbar">
      <div className="text-5xl flex justify-center p-4 bg-gradient-to-r from-[#8F8F8F] via-[#FFFFFF] to-[#999999] bg-clip-text text-transparent">
        AI Multi-Model Image generator
      </div>
      <div className="flex ">
        <Card 
        title="ideogram-ai / ideogram-v3-turbo "
        description="  Turbo is the fastest and cheapest Ideogram v3. v3 creates images with stunning realism, creative designs, and consistent styles "
        identifier="ideogram-ai/ideogram-v3-turbo"
        />
        <Card 
        title="minimax / video-01"
        description="Generate 6s videos with prompts or images. (Also known as Hailuo). Use a subject reference to make a video with a character and the S2V-01 model."
        identifier="minimax/video-01"
        />
        <Card 
        title="black-forest-labs / flux-kontext-pro"
        description="A text-based image editing model that delivers high-quality outputs with excellent prompt following and consistent results for transforming images through natural language"
        identifier="black-forest-labs/flux-kontext-pro"
        />
      </div>
      <div className="flex">
        <Card 
        title="resemble-ai / chatterbox "
        description=" Generate expressive, natural speech. Features unique emotion control, instant voice cloning from short audio, and built-in watermarking. "
        identifier="resemble-ai/chatterbox"
        />
        <Card 
        title=" luma / reframe-video "
        description=" Change the aspect ratio of any video up to 30 seconds long, outputs will be 720p "
        identifier="luma/reframe-video"
        />
        <Card 
        title="google / imagen-4 "
        description="  Google's Imagen 4 flagship model "
        identifier="google/imagen-4"
        />
      </div>
    </div>
  );
}
