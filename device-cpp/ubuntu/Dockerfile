FROM ubuntu 

RUN apt update
RUN apt install -y git
RUN apt install -y build-essential
RUN apt install zlib1g-dev
RUN apt install -y libcurl4-openssl-dev
RUN apt install -y cmake
WORKDIR "/mycpp"
RUN git clone https://github.com/realm/realm-cpp.git
WORKDIR "/mycpp/realm-cpp"
RUN git checkout lm/update
RUN git submodule update --init --recursive
WORKDIR "/mycpp/realm-cpp/realm-core"
RUN git checkout 55a48c287b5e3a8ca129c257ec7e3b92bcb2a05f
WORKDIR "/mycpp/realm-cpp"
RUN mkdir build.debug
WORKDIR "/mycpp/realm-cpp/build.debug"
RUN cmake -D CMAKE_BUILD_TYPE=debug ..
RUN cmake --build . --target install
