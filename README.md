# DocuBrain - Your Intelligent Document Assistant

DocuBrain is a modern web application built with Next.js and powered by Google's Gemini AI through Genkit. It allows users to upload documents (PDFs or text files) and interact with them in powerful ways. Get instant summaries, ask specific questions about the content, and test your knowledge with AI-generated challenges.


## Project Link(live): [https://docu-brain.vercel.app/](https://docu-brain.vercel.app/)
## Video Link:  [You Tube](https://youtu.be/7DV2jVMYh0M)

## 🖼️ Screenshots

<table>
  <tr>
    <td><img src="https://github.com/ambujpandey1/DocuBrain/blob/main/ProjectScreenShot/scr1.png" width="500"/></td>
    <td><img src="https://github.com/ambujpandey1/DocuBrain/blob/main/ProjectScreenShot/scr2.png" width="500"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/ambujpandey1/DocuBrain/blob/main/ProjectScreenShot/scr3.png" width="500"/></td>
    <td><img src="https://github.com/ambujpandey1/DocuBrain/blob/main/ProjectScreenShot/scr4.png" width="500"/></td>
  </tr>
</table>

    
## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Running the Application](#running-the-application)
- [File Structure](#file-structure)
- [Contact](#contact)

## Features

- **Seamless Document Upload**: Easily upload your `.pdf` or `.txt` files through a user-friendly drag-and-drop interface.
- **Instant AI Summaries**: Get concise, AI-generated summaries of your documents in seconds. Grasp key points without reading through pages of text.
- **Ask Anything Mode**: Chat with your document. Ask specific questions and get answers with justifications, pulled directly from the source material.
- **Challenge Me Mode**: Test your comprehension with AI-generated questions based on your document. A fun way to ensure you've understood the content.
- **Secure User Authentication**: Uses Firebase Authentication for secure sign-up and login with email/password or Google accounts.
- **Responsive & Modern UI**: A clean, responsive interface built with Tailwind CSS and ShadCN UI, providing a great experience on any device.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini Models
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/) 

### Installation & Setup

1.  **Clone the repository**
    Replace `your-github-username` with your actual GitHub username.

    ```sh
    git clone https://github.com/ambujpandey1/DocuBrain.git
    cd DocuBrain
    ```

2.  **Install dependencies**

    ```sh
    npm install
    ```

3.  **Set up environment variables**

    Create a file named `.env` in the root of your project directory. You will need to populate it with your credentials from Firebase and Google AI.

    First, copy the example file:

    ```sh
    cp .env.example .env
    ```

    Next, fill in the values in your new `.env` file:

    - **Firebase**:

      - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
      - In your project, go to Project Settings (click the gear icon) > General.
      - Under "Your apps", create a new Web App.
      - Firebase will provide you with a `firebaseConfig` object. Copy the values into your `.env` file.

    - **Google AI (for Genkit)**:
      - Go to [Google AI Studio](https://aistudio.google.com/).
      - Click "Get API key" and create a new API key.
      - Copy this key.

    Your `.env` file should look like this:

    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
    NEXT_PUBLIC_FIREBASE_APP_ID=1:12345:web:abcd...

    # Google AI API Key for Genkit
    # GOOGLE_API_KEY=your-google-ai-api-key
    ```

    _Note: The `GOOGLE_API_KEY` is used by Genkit on the server side and does not need the `NEXT_PUBLIC_` prefix._

### Running the Application

Once the setup is complete, you can run the development server:

```sh
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## File Structure

Here is an overview of the key directories and files in the project:

```
.
├── public/                # Static assets
├── src/
│   ├── ai/                # Genkit AI configuration and flows
│   │   ├── flows/         # AI flow definitions (summarize, challenge, etc.)
│   │   └── genkit.ts      # Genkit initialization
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Route group for auth pages
│   │   ├── dashboard/     # The main application dashboard page
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Landing/Home page
│   │   └── actions.ts     # Server Actions for AI processing
│   ├── components/        # Reusable React components
│   │   ├── ui/            # ShadCN UI components
│   │   └── ...            # Custom application components
│   ├── context/           # React context providers (e.g., AuthContext)
│   ├── hooks/             # Custom React hooks (e.g., useToast)
│   ├── lib/               # Utility functions, types, and configs
│   │   ├── firebase.ts    # Firebase initialization
│   │   ├── types.ts       # TypeScript type definitions
│   │   └── utils.ts       # Shared utility functions
│   └── ...
├── .env                     # Environment variables (ignored by Git)
├── next.config.ts           # Next.js configuration
├── package.json
└── tailwind.config.ts       # Tailwind CSS configuration
```

## Contact

Ambuj Pandey - [@ambujpandey1](https://www.linkedin.com/in/ambujpandey1/) - ambujp863@gmail.com

Project Link: [https://docu-brain.vercel.app/](https://docu-brain.vercel.app/)
