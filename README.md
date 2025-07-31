# AI Tool Explorer

# Frontend Assignment: AI Tool Explorer using Replicate API

##  Objective

Create a **Next.js frontend application** where users can:
- Browse and select AI models (from Replicate)
- Read model details
- Run a model using inputs defined in its API docs
- View the output in a clean UI

This assignment is designed to test your **Next.js architecture**, **state handling**, and ability to **read and use API documentation effectively**.

---

##  What You’ll Be Evaluated On

- **Next.js**: App routing, dynamic routes, API route usage
- **API Integration**: Using Replicate API correctly (based on documentation)
- **State Management**: UI states: idle → loading → success/error
- **Component Design**: Clean and modular input/output components
- **Documentation Usage**: Ability to understand and apply model-specific schema

---

## Key Features to Build

### 1. Model Explorer Page

- A list of 3–5 AI models from Replicate

Example : Flux Schnell, Flux Dev, SDXL,   https://replicate.com/collections/text-to-image, keep an eye on pricing as you have limited free credits 

- Each model shows:
    - Model name
    - Short description
    - “Try It” button

### 2. Model Detail Page (`/model/[slug]`)

- Shows:
    - Model name and detailed description
    - Input fields (based on the model’s API schema)
    - “Generate” button
    - Display output below after generation
- Use Replicate’s latest model version in API request
- Maintain and show loading/error/success state

### 3. Model Runner

- Make POST request to Replicate’s model inference endpoint
- Include authentication using token from `.env`
- Display the final image/text/video output in clean layout

---

##  Tech Stack

- **Framework**: Next.js  (App Router)
- **State**: (your choice)
- **Styling**: Tailwind CSS (preferred) or any CSS solution
- **API**: Replicate API

---

##  Reference Materials

- Replicate Docs: https://replicate.com/docs
- Sample model: https://replicate.com/stability-ai/sdxl

---

##  Deliverables

- **GitHub Repo**: Well-structured project with code and `README.md`
- **.env.example**: Placeholder for the Replicate token
- **README**: Must include setup steps, decisions made, and screenshots (or Loom video demo)
- Deployment URL (vercel)
- **Figma Matching**: Follow this design file for layout and components
 [Figma File](https://www.figma.com/design/0DIm3sWRI8Pl8At9ucrJz5/Assignment?node-id=0-1&t=TcLcreUT8gykaRcm-1)

---

##  Bonus (Optional)

- Use dynamic forms that auto-adapt to any model schema from Replicate
- Show model inference time or status updates
- Add loading skeleton or progress bar