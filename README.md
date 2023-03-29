# Intranet Image Generator
I wanted to show my kids what I do for a living and what better way to make Computer Vision interesting than diffusion models.
I could have just shown them DALL-E 2, but what would be the fun in that?

So I built 
- a simple React Native mobile app that takes a prompt as input and shows the generated images
- a Python backend with a Flask-based API and Stable Diffusion running inference on an RTX 3090 GPU, with the plan to containerise with Docker

<b>work in progress!</b>

### How it works:
images to be added


### Set up: 
1. env variables (e.g. in a .env file) 
- HF_KEY, for your Hugging Face API key 
- IMG_DIR_WIN and IMG_DIR_DOCKER, location to store the generated images
- PROMPT_PREFIX and PROMPT_SUFFIX, optional, if you want to prefix or suffix the prompt with anything (e.g. cartoonish, kids friendly)
- NEGATIVE_PROMPT, optional, can be used for parental controls (e.g. add "scary" to prevent convergence on scary images, et cetera)
- MODEL_ID, optional, Hugging Face model ID, using SD 2.1 if not defined

2. expose port 5000 on the machine running the backend to your intranet 

3. As of now, to get the mobile app running you need to set up a React Native dev environment, compile the app from source and load the .apk onto an Android device using developer mode.
Here is a handy guide: https://reactnative.dev/docs/environment-setup?guide=native



### Known issues:
- I couldn't test if Docker works at all, as my NVIDIA drivers do not want to play with Docker in my Windows Linux Subsystem
- The mobile app still has the default android icon and named "mobile_client"
- minimal security, this is only intended to be used behind a NAT router for demo purposes
- I set up an extensive negative prompt as patential control (in addition to using the Stability safety filter) and I don't let the kids play with diffusion models without supervision.

