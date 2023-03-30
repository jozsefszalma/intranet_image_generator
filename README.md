# Intranet Image Generator
I wanted to show my family what I do for a living and what better way to make Computer Vision interesting than diffusion models?
I could have just shown them DALL-E 2, but what would be the fun in that?

So I built: 
- a simple React Native mobile app that takes a prompt as input and displays the generated images
- a Python backend with a Flask-based API and Stable Diffusion running inference on an RTX 3090 GPU, with plans to containerize using Docker

<b>Work in progress!</b>


### How it works:
images to be added


### Set up: 
1. Environment variables on the backend (e.g. in a .env file) 
- HF_KEY: Your Hugging Face API key 
- IMG_DIR_WIN and IMG_DIR_DOCKER: Location to store the generated images
- PROMPT_PREFIX and PROMPT_SUFFIX: Optional, if you want to prefix or suffix the prompt with anything (e.g. cartoonish, kid-friendly)
- NEGATIVE_PROMPT: Optional, but should be used for parental controls (e.g. add "scary" to prevent convergence on scary images, the same with NSFW concepts, etc.)
- MODEL_ID: Optional, Hugging Face model ID, using SD 2.1 if not defined

2. expose port 5000 on the machine running the backend to your **intra**net 

3. As of now, to get the mobile app running, you need to set up a React Native development environment, compile the app from source and load the .apk onto an Android device using developer mode.
Here is a handy guide: https://reactnative.dev/docs/environment-setup?guide=native


### Known issues and Disclaimers:
- This is a hobby prototype that takes quite a bit of tech skills to get to work and is not production ready. You shouldn't use it if you don't understand the technology involved. Read the license terms, especially Section 5 – Disclaimer of Warranties and Limitation of Liability.
- I couldn't test if Docker works at all, as my NVIDIA drivers do not want to play with Docker in my Windows Linux Subsystem
- The mobile app still has the default Android icon and is named "mobile_client"
- Minimal security (not making any attempts to sanitize inputs or authenticate clients), the backend is only intended to be used behind a NAT router for demo purposes, not ready to be exposed to the Internet. 
- I recommend setting up an extensive negative prompt as parental controls, in addition to using the Stability safety filter, and not letting kids play with diffusion models without adult supervision, as **most of these models will produce age-inappropriate content** with minimal effort and curiosity. 


### License:
Copyright 2023, Jozsef Szalma
Creative Commons Attribution-NonCommercial 4.0 International Public License
https://creativecommons.org/licenses/by-nc/4.0/legalcode

