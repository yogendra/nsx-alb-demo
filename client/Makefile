.PHONY: build run publish

publish: build
	- docker push ghcr.io/yogendra/nsx-alb-client:latest

build: 
	- docker build -t ghcr.io/yogendra/nsx-alb-client:latest . 

run: build
	- docker run --rm -it -p 3000:8080 ghcr.io/yogendra/nsx-alb-client:latest


