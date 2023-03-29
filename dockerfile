# Use the official NVIDIA PyTorch image as a base
#FROM nvcr.io/nvidia/pytorch:21.09-py3
FROM nvcr.io/nvidia/pytorch:23.03-py3

# Set the working directory
WORKDIR /app

# Create the /data/images directory
RUN mkdir -p /data/images

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY app.py .

# Expose the port your API is running on
EXPOSE 5000

# Define the environment variable to enable NVIDIA GPU support
ENV NVIDIA_VISIBLE_DEVICES all

# Start the Flask app
CMD ["python", "app.py"]