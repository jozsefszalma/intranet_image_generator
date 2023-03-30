# License:
# Copyright 2023, Jozsef Szalma <br>
# Creative Commons Attribution-NonCommercial 4.0 International Public License<br>
# https://creativecommons.org/licenses/by-nc/4.0/legalcode

import os
import uuid
from flask import Flask, request, send_from_directory
from flask_restful import Api, Resource

from huggingface_hub import login
from diffusers import StableDiffusionPipeline
from diffusers.pipelines.stable_diffusion import StableDiffusionSafetyChecker
from transformers import CLIPFeatureExtractor

import torch

#huggingface key
hf_key = os.getenv("HF_KEY")

#output directory
image_dir = os.getenv("IMG_DIR_DOCKER") 

#optional, if you want to prefix or suffix the prompt with anything (e.g. cartoonish, kids friendly)
prompt_prefix = os.getenv("PROMPT_PREFIX", "")
prompt_suffix = os.getenv("PROMPT_SUFFIX", "")

#optional, can be used for parental controls (e.g. add "scary" to prevent convergence on scary images, et cetera)
negative_prompt = os.getenv("NEGATIVE_PROMPT","")

login(token=hf_key,add_to_git_credential=False)
#Hugging Face model ID, using SD 2.1 if not defined in env
model_id = os.getenv("MODEL_ID","stabilityai/stable-diffusion-2-1") 

app = Flask(__name__)
api = Api(app)

#image generator api, generates the image and returns a GUID that acts as key for image retrieval 
class ImageGeneration(Resource):
    def post(self):
        data = request.get_json()
        prompt = data['prompt']
        image_id = str(uuid.uuid4())

        result = pipe(prompt = prompt_prefix + " " + prompt + " " + prompt_suffix,
                      negative_prompt = negative_prompt)

        nsfw_loop_count = 0
        while result.nsfw_content_detected[0]:
            result = pipe(prompt = prompt_prefix + " " + prompt + " " + prompt_suffix,
                      negative_prompt = negative_prompt)
            nsfw_loop_count += 1
            if nsfw_loop_count > 10 : 
                result = pipe(prompt = "",
                      negative_prompt = negative_prompt)
                break
            
            
        image = result.images[0]
        image.save(os.path.join(image_dir, f"{image_id}.png"))
        
        print("nsfw? ", result.nsfw_content_detected[0])
        print("prompt: ", prompt)
        print("image id: ", image_id)
       
        return {'guid': image_id}

#image retrieval api, serves the image that matches the GUID provided
class ImageRetrieval(Resource):
    def get(self):
        image_id = request.args.get('guid')
        print(image_id)
        return send_from_directory(image_dir, f"{image_id}.png")



if __name__ == '__main__':
    
    api.add_resource(ImageGeneration, '/generate/')
    api.add_resource(ImageRetrieval, '/image/')

    if model_id == "stabilityai/stable-diffusion-2-1":
    #SD 2.1 does not have the safety checker by default
        pipe = StableDiffusionPipeline.from_pretrained(model_id, use_auth_token=True, 
                                                        safety_checker=StableDiffusionSafetyChecker.from_pretrained("CompVis/stable-diffusion-safety-checker",torch_dtype=torch.float16),
                                                        feature_extractor=CLIPFeatureExtractor.from_pretrained("openai/clip-vit-base-patch32",torch_dtype=torch.float16),
                                                        torch_dtype=torch.float16)


    else:
        pipe = StableDiffusionPipeline.from_pretrained(model_id, use_auth_token=True, 
                                                    torch_dtype=torch.float16)
    pipe = pipe.to("cuda")
    
    
    app.run(debug=True, use_reloader=False, host='0.0.0.0')