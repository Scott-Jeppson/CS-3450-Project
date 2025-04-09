# This is a docker compose file for the SUMO simulation. It is no longer used, but we 
# should keep it around incase we need to modify the image.

# Use an official Ubuntu base image
FROM ubuntu:20.04

# Avoid interactive prompts during package installs
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies needed to build SUMO
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    libxerces-c-dev \
    libfox-1.6-dev \
    libgdal-dev \
    libproj-dev \
    libgl2ps-dev \
    python3 \
    python3-dev \
    python3-pip \
    gcc-10 \
    g++-10 \
    && rm -rf /var/lib/apt/lists/*

# Set compiler
ENV CC=/usr/bin/gcc-10
ENV CXX=/usr/bin/g++-10

# Clone and build SUMO
RUN git clone --depth 1 --branch v1_20_0 https://github.com/eclipse/sumo.git /opt/sumo
RUN mkdir /opt/sumo/build && cd /opt/sumo/build && \
    cmake .. && \
    make -j$(nproc) && \
    make install

# Set working directory inside the container
WORKDIR /sumo

# Copy requirements and source code into the container
COPY requirements.txt /sumo/
RUN pip3 install --no-cache-dir -r requirements.txt
COPY static /sumo/static/
COPY OremConfig /sumo/OremConfig/
COPY templates /sumo/templates/
COPY simulation.py /sumo/
COPY .env /sumo/

# run the simulation
CMD ["python3", "/sumo/simulation.py"]
