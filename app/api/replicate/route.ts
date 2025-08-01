import { writeFile } from "fs/promises";
import Replicate from "replicate";
const replicate = new Replicate({
    auth: 
});

const input = {
    width: 768,
    height: 768,
    prompt: "An astronaut riding a rainbow unicorn, cinematic, dramatic",
    refine: "expert_ensemble_refiner",
    apply_watermark: false,
    num_inference_steps: 25
};

let model_codes:string[]=[];

const output = await replicate.run("stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc", { input });

// To access the file URLs:
console.log(output[0].url());
//=> "https://replicate.delivery/.../output_0.png"

// To write the files to disk:
for (const [index, item] of Object.entries(output)) {
  await writeFile(`output_${index}.png`, item);
}
//=> output_0.png written to disk