FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

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

ENV CC=/usr/bin/gcc-10
ENV CXX=/usr/bin/g++-10

RUN git clone --depth 1 --branch v1_20_0 https://github.com/eclipse/sumo.git /opt/sumo
RUN mkdir /opt/sumo/build && cd /opt/sumo/build && \
    cmake .. && \
    make -j$(nproc) && \
    make install

WORKDIR /sumo

COPY requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

COPY static ./static/
COPY OremConfig ./OremConfig/
COPY templates ./templates/
COPY simulation.py .
COPY .env .

EXPOSE 80

CMD ["python3", "/sumo/simulation.py"]