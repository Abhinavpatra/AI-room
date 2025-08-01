import { Card } from "@/components/Card";

export default function Home() {
  return (
    <div className="bg-black h-screen flex flex-col overflow-x-scroll no-scrollbar">
      <div className="text-5xl flex justify-center p-4 bg-gradient-to-r from-[#8F8F8F] via-[#FFFFFF] to-[#999999] bg-clip-text text-transparent">
        AI Multi-Model Image generator
      </div>
      <div className="flex ">
        <Card 
        title="stability-ai / sdxl"
        description=" A text-to-image generative AI model that creates beautiful images"
        />
        <Card 
        title="miniimax / video-01"
        description="Generate 6s videos with prompts or images. (Also known as Hailuo). Use a subject reference to make a video with a character and the S2V-01 model."
        />
        <Card 
        title="black-forest-labs / flux-kontext-pro"
        description="A text-based image editing model that delivers high-quality outputs with excellent prompt following and consistent results for transforming images through natural language"
        />
      </div>
      <div className="flex">
        <Card 
        title="resemble-ai / chatterbox "
        description=" Generate expressive, natural speech. Features unique emotion control, instant voice cloning from short audio, and built-in watermarking. "
        />
        <Card 
        title=" luma / reframe-video "
        description=" Change the aspect ratio of any video up to 30 seconds long, outputs will be 720p "
        />
        <Card 
        title="google / imagen-4 "
        description="  Google's Imagen 4 flagship model "
        />
      </div>
    </div>
  );
}
